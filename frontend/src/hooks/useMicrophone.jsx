import { useRef, useState } from "react";

export default function useMicrophone() {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [permission, setPermission] = useState("prompt");
  // prompt | granted | denied
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

      const source = audioContext.createMediaStreamSource(stream);
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
      } else if (err.name === "NotFoundError") {
        setError("No microphone found");
      } else {
        setError("Microphone error");
      }
      throw err;
    }
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
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