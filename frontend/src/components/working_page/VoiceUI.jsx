import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Waveform from "./Waveform";
import Conversation from "./Conversation";
import useMicrophone from "../../hooks/useMicrophone";
import useSession from "../../hooks/useSession";
import {
  playAudioStreamFromElevenLabs,
  stopAudio,
} from "../../services/audioService";

export default function VoiceUI() {
  const sessionId = useSession();

  // idle | listening | ready | processing | speaking | error
  const [state, setState] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [draftText, setDraftText] = useState("");

  const streamRef = useRef(null);

  const {
    startMic,
    stopMic,
    analyserRef,
    dataArrayRef,
    permission,
    error,
  } = useMicrophone();

  /* ---------------------------------------------------- */
  /* MESSAGE HELPERS */
  /* ---------------------------------------------------- */

  const startUserMessage = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: "",
        status: "recording",
      },
    ]);
  };

  const updateUserMessage = (text) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "user" && last.status === "recording") {
        last.text = text || "Listening…";
      }
      return updated;
    });
  };

  const finalizeUserMessage = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "user" && last.status === "recording") {
        last.text = draftText || "…";
        last.status = "done";
      }
      return updated;
    });
  };

  const addAIMessage = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        text: "",
        status: "streaming",
      },
    ]);
  };

  const updateAIMessage = (chunk) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "assistant") {
        last.text += chunk;
      }
      return updated;
    });
  };

  const finishAIMessage = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "assistant") {
        last.status = "done";
      }
      return updated;
    });
  };

  /* ---------------------------------------------------- */
  /* MIC CONTROL */
  /* ---------------------------------------------------- */

  const startListening = async () => {
    if (state !== "idle") return;

    try {
      setDraftText("");
      startUserMessage();
      await startMic();
      setState("listening");
    } catch {
      setState("error");
    }
  };

  const stopListening = async () => {
    if (state !== "listening") return;

    stopMic();
    finalizeUserMessage();
    setState("ready");
  };

  /* ---------------------------------------------------- */
  /* SEND TO AI */
  /* ---------------------------------------------------- */

  const sendToAI = async () => {
    if (state !== "ready") return;
    if (!draftText.trim()) return;

    setState("processing");
    addAIMessage();

    const chunks = [
      "Hello! ",
      "I’m Ora. ",
      "I understand your input ",
      "and respond naturally.",
    ];

    let index = 0;
    streamRef.current = setInterval(() => {
      if (index < chunks.length) {
        updateAIMessage(chunks[index]);
        index++;
      } else {
        clearInterval(streamRef.current);
      }
    }, 350);

    await playAudioStreamFromElevenLabs(
      chunks.join(""),
      () => {
        finishAIMessage();
        setDraftText("");
        setState("idle");
      },
      () => setState("error")
    );
  };

  /* ---------------------------------------------------- */
  /* SINGLE KEYBOARD HANDLER (CRITICAL) */
  /* ---------------------------------------------------- */

  useEffect(() => {
    const onKeyDown = (e) => {
      // Start recording
      if (e.code === "Space" && state === "idle") {
        e.preventDefault();
        startListening();
      }

      // Typing while recording
      if (state === "listening") {
        if (e.key === "Backspace") {
          setDraftText((t) => t.slice(0, -1));
        } else if (
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          e.key !== "Enter"
        ) {
          setDraftText((t) => t + e.key);
        }
      }

      // Send message
      if (e.key === "Enter" && state === "ready") {
        e.preventDefault();
        sendToAI();
      }
    };

    const onKeyUp = (e) => {
      if (e.code === "Space" && state === "listening") {
        e.preventDefault();
        stopListening();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state, draftText]);

  /* ---------------------------------------------------- */
  /* LIVE DRAFT → BUBBLE SYNC */
  /* ---------------------------------------------------- */

  useEffect(() => {
    if (state === "listening") {
      updateUserMessage(draftText);
    }
  }, [draftText, state]);

  /* ---------------------------------------------------- */
  /* CLEANUP */
  /* ---------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopAudio();
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  /* ---------------------------------------------------- */
  /* UI */
  /* ---------------------------------------------------- */

  return (
    <div className="flex flex-col items-center gap-8 w-full">

      {sessionId && (
        <p className="text-xs text-gray-600 py-10">Session: {sessionId}</p>
      )}

      {/* MIC */}
      <motion.div
        onPointerDown={startListening}
        onPointerUp={stopListening}
        whileTap={{ scale: 0.92 }}
        className="
          w-36 h-36 rounded-full
          flex items-center justify-center
          bg-[#0F1115]
          border border-green-400/40
          cursor-pointer
        "
      >
        <span className="text-5xl">🎤</span>
      </motion.div>

      {permission === "granted" && (
        <p className="text-green-400 text-sm pb-5">Microphone connected</p>
      )}

      {state !== "idle" && (
        <Waveform
          mode={state}
          analyserRef={analyserRef}
          dataArrayRef={dataArrayRef}
        />
      )}

      <p className="text-gray-400">
        {state === "idle" && "Hold Space or tap mic"}
        {state === "listening" && "Recording…"}
        {state === "ready" && "Press Enter or Send"}
        {state === "processing" && "Processing…"}
        {state === "speaking" && "Ora is speaking…"}
      </p>

      {/* MOBILE SEND BUTTON */}
      {state === "ready" && (
        <button
          onClick={sendToAI}
          className="
            md:hidden
            px-6 py-3 rounded-full
            bg-green-400 text-black font-semibold
          "
        >
          Send
        </button>
      )}

      <Conversation messages={messages} />
    </div>
  );
}