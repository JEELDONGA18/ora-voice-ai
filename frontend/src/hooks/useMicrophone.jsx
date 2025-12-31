import { useRef, useState } from "react";

export default function useMicrophone() {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);

  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [permission, setPermission] = useState("prompt");
  const [error, setError] = useState(null);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermission("granted");

      const AudioContext =
        window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);

      // 🔊 ANALYSER (UI ONLY)
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      return { analyser, dataArray };
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setPermission("denied");
        setError("Microphone permission denied");
      } else {
        setError("Microphone error");
      }
      throw err;
    }
  };

  const stopMic = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();

    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  return {
    startMic,
    stopMic,
    analyserRef,
    dataArrayRef,
    permission,
    error,
  };
}