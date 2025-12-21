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

  const [state, setState] = useState("idle"); 
  // idle | listening | processing | speaking | error

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
        last.text = "User voice input…"; // replace with transcript later
        last.status = "done";
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
    setState("processing");

    // MOCK BACKEND + STREAMING AI
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
    }, 700);
  };

  /* ---------------- SPACEBAR PUSH-TO-TALK ---------------- */

  useEffect(() => {
    const down = (e) => {
      if (e.code === "Space" && !holdingRef.current) {
        e.preventDefault();
        startListening();
      }
    };

    const up = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        stopListening();
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [state]);

  /* ---------------- INTERRUPT AI IF USER TALKS ---------------- */

  useEffect(() => {
    if (state === "listening") {
      stopAudio();
      if (streamRef.current) {
        clearInterval(streamRef.current);
      }
    }
  }, [state]);

  /* ---------------- CLEANUP ON UNMOUNT ---------------- */

  useEffect(() => {
    return () => {
      stopAudio();
      if (streamRef.current) {
        clearInterval(streamRef.current);
      }
    };
  }, []);

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

      {/* WAVEFORM (ALL ACTIVE STATES) */}
      {state !== "idle" && (
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
        {state === "error" && "Something went wrong"}
      </p>

      {/* CONVERSATION */}
      <Conversation messages={messages} />

    </div>
  );
}