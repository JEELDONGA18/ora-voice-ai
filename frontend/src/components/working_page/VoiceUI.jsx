import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Waveform from "./Waveform";
import Conversation from "./Conversation";
import useMicrophone from "../../hooks/useMicrophone";
import useSession from "../../hooks/useSession";
import {
  startVoiceSession,
  closeVoiceSession,
  submitText,
  sendUserText,
} from "../../services/audioService";

export default function VoiceUI() {
  const { sessionId } = useSession();

  const [state, setState] = useState("idle"); // idle | listening | processing | speaking
  const [messages, setMessages] = useState([]);

  const audioContextRef = useRef(null);
  const ttsChunksRef = useRef([]);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const isEditableRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  const {
    startMic,
    stopMic,
    analyserRef,
    dataArrayRef,
    permission,
  } = useMicrophone();

  useEffect(() => {
    if (!sessionId) return;

    startVoiceSession({
      sessionId,
      onAudioChunk: onTTSChunk,
      onTTSEnd: playFinalTTS,
      onAIText: updateAIMessage,
    });

    return () => {
      closeVoiceSession();
    };
  }, [sessionId]);

  /* ---------------- Unlock Audio ---------------- */

  useEffect(() => {
    const unlock = () => {
      hasUserInteractedRef.current = true;
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  /* ---------------- Web Speech API ---------------- */

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = transcriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += (finalText ? " " : "") + res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }

      transcriptRef.current = finalText;
      updateUserText(finalText + interim);
    };

    recognition.onend = () => {
      updateUserText(transcriptRef.current);
      isEditableRef.current = true;
    };

    recognition.onerror = () => {
      stopListening();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  /* ---------------- TTS ---------------- */

  const onTTSChunk = (chunk) => {
    ttsChunksRef.current.push(chunk);
  };

  const playFinalTTS = async () => {
    if (!ttsChunksRef.current.length) return;

    audioContextRef.current ||= new AudioContext();

    const total = ttsChunksRef.current.reduce((s, b) => s + b.byteLength, 0);
    const merged = new Uint8Array(total);
    let offset = 0;

    for (const c of ttsChunksRef.current) {
      merged.set(new Uint8Array(c), offset);
      offset += c.byteLength;
    }

    const buffer =
      await audioContextRef.current.decodeAudioData(merged.buffer);

    const src = audioContextRef.current.createBufferSource();
    src.buffer = buffer;
    src.connect(audioContextRef.current.destination);
    src.start();

    ttsChunksRef.current = [];
    setState("speaking");

    src.onended = () => setState("idle");
  };

  /* ---------------- Messages ---------------- */

  const createUserMessage = () => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: "", status: "recording" },
    ]);
  };

  const updateUserText = (text) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "user" && last.status === "recording") {
        last.text = text;
      }
      return updated;
    });

    // ✅ SEND TEXT TO BACKEND
    sendUserText(text);

    isEditableRef.current = true;
  };

  const finalizeUserMessage = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "user") last.status = "done";
      return updated;
    });
  };

  const addAIMessage = () => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", text: "", status: "streaming" },
    ]);
  };

  const updateAIMessage = (text) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "assistant") {
        last.text = text;
        last.status = "done";
      }
      return updated;
    });
    setState("speaking");
  };

  /* ---------------- Listening ---------------- */

  const startListening = async () => {
    if (state !== "idle" || !sessionId) return;

    audioContextRef.current ||= new AudioContext();
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (!isEditableRef.current) {
      transcriptRef.current = "";
      createUserMessage();
    }

    isEditableRef.current = false;

    await startMic();
    startSpeechRecognition();
    setState("listening");
  };

  const stopListening = () => {
    if (state !== "listening") return;
    stopMic();
    stopSpeechRecognition();
    setState("idle");
    isEditableRef.current = true;
  };

  /* ---------------- Keyboard ---------------- */

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && state === "idle") {
        if (!hasUserInteractedRef.current) return;
        e.preventDefault();
        startListening();
        return;
      }

      if (e.key === "Enter" && isEditableRef.current && state === "idle") {
        const last = messages[messages.length - 1];
        if (!last?.text.trim()) return;

        e.preventDefault();
        finalizeUserMessage();
        isEditableRef.current = false;
        addAIMessage();
        setState("processing");
        submitText(transcriptRef.current);
        return;
      }

      if (e.key === "Backspace" && isEditableRef.current) {
        e.preventDefault();
        transcriptRef.current = transcriptRef.current.slice(0, -1);
        updateUserText(transcriptRef.current);
        return;
      }

      if (e.key.length === 1) e.preventDefault();
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
  }, [state, messages]);

  /* ---------------- Cleanup ---------------- */

  useEffect(() => {
    return () => {
      closeVoiceSession();
      audioContextRef.current?.close();
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-xs text-gray-600 py-10">Session: {sessionId}</p>

      <motion.div
        onClick={() => {
          hasUserInteractedRef.current = true;
          if (state === "idle") startListening();
          else stopListening();
        }}
        whileTap={{ scale: 0.92 }}
        className="w-36 h-36 rounded-full flex items-center justify-center bg-[#0F1115] border border-green-400/40 cursor-pointer mb-12"
      >
        <span className="text-5xl">🎤</span>
      </motion.div>

      {permission === "denied" && (
        <p className="text-red-400 text-sm">Microphone permission denied.</p>
      )}

      {state !== "idle" && (
        <Waveform
          mode={state}
          analyserRef={analyserRef}
          dataArrayRef={dataArrayRef}
        />
      )}

      <p className="text-gray-400">
        {state === "idle" && "Press Space or click mic to speak"}
        {state === "listening" && "Recording…"}
        {state === "processing" && "Processing…"}
        {state === "speaking" && "Ora is speaking…"}
      </p>

      <Conversation messages={messages} />
    </div>
  );
}