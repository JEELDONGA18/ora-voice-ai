// import { useRef, useState } from "react";

// export default function useMicrophone() {
//   const streamRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);

//   const [permission, setPermission] = useState("prompt");
//   // prompt | granted | denied
//   const [error, setError] = useState(null);

//   const startMic = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       setPermission("granted");

//       const AudioContext =
//         window.AudioContext || window.webkitAudioContext;
//       const audioContext = new AudioContext();
//       audioContextRef.current = audioContext;

//       const source = audioContext.createMediaStreamSource(stream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256;

//       const bufferLength = analyser.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       source.connect(analyser);

//       analyserRef.current = analyser;
//       dataArrayRef.current = dataArray;

//       return { analyser, dataArray };
//     } catch (err) {
//       if (err.name === "NotAllowedError") {
//         setPermission("denied");
//         setError("Microphone permission denied");
//       } else if (err.name === "NotFoundError") {
//         setError("No microphone found");
//       } else {
//         setError("Microphone error");
//       }
//       throw err;
//     }
//   };

//   const stopMic = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop());
//       streamRef.current = null;
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//   };

//   return {
//     startMic,
//     stopMic,
//     analyserRef,
//     dataArrayRef,
//     permission,
//     error,
//   };
// }
import { useRef, useState } from "react";

export default function useMicrophone(onAudioChunk) {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);

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
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Analyser (UI)
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      // Audio processor (REAL AUDIO)
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }

        onAudioChunk?.(pcm16);
      };

      processorRef.current = processor;

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
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();

    processorRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
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
