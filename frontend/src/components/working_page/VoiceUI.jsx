  import React, { useState, useEffect, useRef } from "react";
  import { motion } from "framer-motion";
  import Waveform from "./Waveform";
  import Conversation from "./Conversation";
  import useMicrophone from "../../hooks/useMicrophone";
  import useSession from "../../hooks/useSession";
  import {
    startVoiceSession,
    endAudioStream,
    closeVoiceSession,
    sendAudioChunk,
    submitText,
  } from "../../services/audioService";

  export default function VoiceUI() {
    const { sessionId } = useSession();

    const [state, setState] = useState("idle");
    const [messages, setMessages] = useState([]);

    const audioContextRef = useRef(null);
    const ttsChunksRef = useRef([]);
    const isEditableRef = useRef(false);

    const {
      startMic,
      stopMic,
      analyserRef,
      dataArrayRef,
      permission,
    } = useMicrophone((pcmBuffer) => {
      sendAudioChunk(pcmBuffer);
    });

    /* ---------------- Local Storage ---------------- */

    useEffect(() => {
      if (sessionId && messages.length) {
        localStorage.setItem(
          `conversation:${sessionId}`,
          JSON.stringify(messages)
        );
      }
    }, [messages, sessionId]);

    useEffect(() => {
      if (!sessionId) return;
      const saved = localStorage.getItem(`conversation:${sessionId}`);
      if (saved) setMessages(JSON.parse(saved));
    }, [sessionId]);

    /* ---------------- TTS ---------------- */

    const onTTSChunk = (chunk) => {
      ttsChunksRef.current.push(chunk);
    };

    const playFinalTTS = async () => {
      if (!ttsChunksRef.current.length) return;

      audioContextRef.current ||= new AudioContext();

      const total = ttsChunksRef.current.reduce(
        (s, b) => s + b.byteLength,
        0
      );

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

    const startUserMessage = () => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text: "", status: "recording" },
      ]);
    };

    const updateUserText = (text) => {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "user") {
          last.text = text;
          last.status = "recording";
        }
        return updated;
      });
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
    };

    /* ---------------- Mic Control ---------------- */

    const startListening = async () => {
      if (state !== "idle" || !sessionId) return;

      isEditableRef.current = false;
      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (!last || last.role !== "user" || last.status === "done") {
          return [
            ...prev,
            {
              id: Date.now(),
              role: "user",
              text: "",
              status: "recording",
            },
          ];
        }

        return prev; // reuse existing bubble
      });

      startVoiceSession({
        sessionId,
        onAudioChunk: onTTSChunk,
        onTTSEnd: playFinalTTS,
        onAIText: updateAIMessage,
        onUserText: (text) => {
          console.log("STT TEXT:", text);
          updateUserText(text);
          isEditableRef.current = true;
        },
      });

      await startMic();
      setState("listening");
    };

    const stopListening = () => {
      if (state !== "listening") return;
      console.log("🎯 SPACE RELEASED → STT");
      stopMic();
      endAudioStream();
      setState("idle");
      isEditableRef.current = true;
    };

    /* ---------------- Keyboard ---------------- */

    useEffect(() => {
      const onKeyDown = (e) => {
        if (e.code === "Space" && state === "idle") {
          e.preventDefault();
          startListening();
          return;
        }

        if (
          e.key === "Backspace" &&
          state === "idle" &&
          isEditableRef.current
        ) {
          e.preventDefault();
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "user") {
              last.text = last.text.slice(0, -1);
            }
            return updated;
          });
          return;
        }

        if (
          e.key === "Enter" &&
          state === "idle" &&
          isEditableRef.current
        ) {
          const last = messages[messages.length - 1];
          // 🚫 block empty submit
          if (!last || !last.text.trim()) {
            return;
          }
          e.preventDefault();
          finalizeUserMessage();
          isEditableRef.current = false;
          addAIMessage();
          setState("processing");
          submitText();
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
    }, [state, sessionId]);

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
        <p className="text-xs text-gray-600 py-10">
          Session: {sessionId}
        </p>

        <motion.div
          onPointerDown={startListening}
          onPointerUp={stopListening}
          whileTap={{ scale: 0.92 }}
          className="w-36 h-36 rounded-full flex items-center justify-center bg-[#0F1115] border border-green-400/40 cursor-pointer"
        >
          <span className="text-5xl">🎤</span>
        </motion.div>

        {permission === "granted" && (
          <p className="text-green-400 text-sm">Microphone connected</p>
        )}

        {state !== "idle" && (
          <Waveform
            mode={state}
            analyserRef={analyserRef}
            dataArrayRef={dataArrayRef}
          />
        )}

        <p className="text-gray-400">
          {state === "idle" && "Hold Space to speak, Enter to send"}
          {state === "listening" && "Recording…"}
          {state === "processing" && "Processing…"}
          {state === "speaking" && "Ora is speaking…"}
        </p>

        <Conversation messages={messages} />
      </div>
    );
  }