import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Waveform from "./Waveform";
import Conversation from "./Conversation";
import useMicrophone from "../../hooks/useMicrophone";
import useSession from "../../hooks/useSession";
import { playAudioStreamFromElevenLabs, stopAudio } from "../../services/audioService";

export default function VoiceUI() {
  const sessionId = useSession();

  const [state, setState] = useState("idle"); // idle | listening | processing | speaking | error
  const [messages, setMessages] = useState([]);

  const holdingRef = useRef(false);

  const {
    startMic,
    stopMic,
    analyserRef,
    dataArrayRef,
    permission,
    error,
  } = useMicrophone();

  /* ---------------- MESSAGE HELPERS ---------------- */

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text,
        status: "done",
      },
    ]);
  };

  const addAIPlaceholder = () => {
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

      if (last && last.role === "assistant") {
        last.text += chunk;
      }
      return updated;
    });
  };

  const finishAIMessage = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === "assistant") {
        last.status = "done";
      }
      return updated;
    });
  };

  /* ---------------- MIC CONTROL ---------------- */

  const startListening = async () => {
    if (state !== "idle") return;

    try {
      holdingRef.current = true;
      await startMic();
      setState("listening");
    } catch {
      setState("error");
    }
  };

  const stopListening = async () => {
    if (state !== "listening") return;

    holdingRef.current = false;
    stopMic();

    // USER MESSAGE (replace later with real transcript)
    addUserMessage("User voice input…");

    setState("processing");

    // MOCK BACKEND + STREAMING RESPONSE
    setTimeout(async () => {
      setState("speaking");
      addAIPlaceholder();

      const chunks = [
        "Hello! ",
        "I’m Ora. ",
        "I can understand your voice ",
        "and respond naturally in real time.",
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < chunks.length) {
          updateAIMessage(chunks[index]);
          index++;
        } else {
          clearInterval(interval);
          finishAIMessage();
        }
      }, 350);

      await playAudioStreamFromElevenLabs(
        "Hello! I’m Ora. I can understand your voice and respond naturally.",
        () => setState("idle"),
        () => setState("error")
      );
    }, 700);
  };

  /* ---------------- SPACEBAR PUSH-TO-TALK ---------------- */

  useEffect(() => {
    const keyDown = (e) => {
      if (e.code === "Space" && !holdingRef.current) {
        e.preventDefault();
        startListening();
      }
    };

    const keyUp = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        stopListening();
      }
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [state]);

  /* ---------------- INTERRUPT AI IF USER TALKS ---------------- */

  useEffect(() => {
    if (state === "listening") {
      stopAudio();
    }
  }, [state]);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col items-center gap-10 w-full">

      {/* SESSION DEBUG */}
      {sessionId && (
        <p className="text-xs text-gray-600">
          Session: {sessionId}
        </p>
      )}

      {/* MIC BUTTON */}
      <motion.div
        onPointerDown={startListening}
        onPointerUp={stopListening}
        onPointerLeave={stopListening}
        whileTap={{ scale: 0.92 }}
        className="
          relative w-36 h-36 rounded-full
          flex items-center justify-center
          bg-[#0F1115]
          border border-green-400/40
          cursor-pointer
        "
      >
        <span className="text-5xl">🎤</span>
      </motion.div>

      {/* MIC STATUS */}
      {permission === "granted" && (
        <p className="text-green-400 text-sm">
          Microphone connected
        </p>
      )}
      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* WAVEFORM */}
      {state === "idle" && (
        <Waveform
          mode={state}
          analyserRef={analyserRef}
          dataArrayRef={dataArrayRef}
        />
      )}

      {/* STATE TEXT */}
      <p className="text-gray-400">
        {state === "idle" && "Hold mic or Spacebar to talk"}
        {state === "listening" && "Listening…"}
        {state === "processing" && "Processing…"}
        {state === "speaking" && "Ora is speaking…"}
      </p>

      {/* CONVERSATION */}
      <Conversation messages={messages} />

    </div>
  );
}
