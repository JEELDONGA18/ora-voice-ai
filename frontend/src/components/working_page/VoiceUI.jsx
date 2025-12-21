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
  const holdingRef = useRef(false);
  const streamRef = useRef(null);

  const {
    startMic,
    stopMic,
    analyserRef,
    dataArrayRef,
    permission,
    error,
  } = useMicrophone();

  /* ---------------- MESSAGE HELPERS ---------------- */

  const addRecordingBubble = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: "Listening…",
        status: "recording",
      },
    ]);
  };

  const finalizeUserBubble = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.status === "recording") {
        last.text = "User voice input…"; // later replace with transcript
        last.status = "pending";
      }
      return updated;
    });
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

  const pushErrorMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        text: msg,
        status: "error",
      },
    ]);
  };

  /* ---------------- MIC CONTROL ---------------- */

  const startListening = async () => {
    if (state !== "idle") return;

    try {
      holdingRef.current = true;
      addRecordingBubble();
      await startMic();
      setState("listening");
    } catch {
      setState("error");
      pushErrorMessage("Microphone access failed.");
    }
  };

  const stopListening = async () => {
    if (state !== "listening") return;

    holdingRef.current = false;
    stopMic();
    finalizeUserBubble();
    setState("ready"); // ⬅️ WAIT FOR ENTER
  };

  /* ---------------- SEND TO AI (ENTER KEY) ---------------- */

  const sendToAI = async () => {
    if (state !== "ready") return;

    setState("processing");

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
      streamRef.current = setInterval(() => {
        if (index < chunks.length) {
          updateAIMessage(chunks[index]);
          index++;
        } else {
          clearInterval(streamRef.current);
          finishAIMessage();
        }
      }, 350);

      await playAudioStreamFromElevenLabs(
        chunks.join(""),
        () => setState("idle"),
        () => {
          setState("error");
          pushErrorMessage("Audio playback failed.");
        }
      );
    }, 600);
  };

  /* ---------------- KEYBOARD CONTROLS ---------------- */

  useEffect(() => {
    const keyDown = (e) => {
      if (e.code === "Space" && state === "idle") {
        e.preventDefault();
        startListening();
      }

      if (e.code === "Enter" && state === "ready") {
        e.preventDefault();
        sendToAI();
      }
    };

    const keyUp = (e) => {
      if (e.code === "Space" && state === "listening") {
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
      if (streamRef.current) clearInterval(streamRef.current);
    }
  }, [state]);

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      stopAudio();
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col items-center gap-10 w-full">

      {sessionId && (
        <p className="text-xs text-gray-600">
          Session: {sessionId}
        </p>
      )}

      {/* MIC */}
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

      {state !== "idle" && (
        <Waveform
          mode={state}
          analyserRef={analyserRef}
          dataArrayRef={dataArrayRef}
        />
      )}

      <p className="text-gray-400">
        {state === "idle" && "Hold Space or mic to talk"}
        {state === "listening" && "Recording…"}
        {state === "ready" && "Press Enter to send"}
        {state === "processing" && "Processing…"}
        {state === "speaking" && "Ora is speaking…"}
        {state === "error" && "Something went wrong"}
      </p>

      <Conversation messages={messages} />
    </div>
  );
}