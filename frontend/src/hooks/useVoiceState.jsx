// useVoice.js
import { useState } from "react";

export default function useVoiceState() {
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const startListening = () => {
    setError(null);
    setState("listening");
  };

  const startProcessing = () => {
    setState("processing");
  };

  const startSpeaking = () => {
    setState("speaking");
  };

  const stopSpeaking = () => {
    setState("idle");
  };

  const setVoiceError = (message) => {
    setError(message);
    setState("error");
  };

  const reset = () => {
    setError(null);
    setState("idle");
  };

  return {
    state,        // idle | listening | processing | speaking | error
    error,

    startListening,
    startProcessing,
    startSpeaking,
    stopSpeaking,
    setVoiceError,
    reset,
  };
}
