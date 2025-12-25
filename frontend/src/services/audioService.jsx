// services/audioService.js

import { WS_BASE_URL } from "./apiService";

let ws = null;

/**
 * Start a voice session with backend
 */
export function startVoiceSession({ sessionId, onAudioChunk, onTTSEnd, onAIText, onUserText}) {
  ws = new WebSocket(`${WS_BASE_URL}/api/voice/${sessionId}`);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    console.log("🎤 WebSocket connected");
  };

  ws.onmessage = (event) => {
    // 🔊 Binary audio
    if (event.data instanceof ArrayBuffer) {
      onAudioChunk?.(event.data);
      return;
    }

    // 📩 JSON message
    const data = JSON.parse(event.data);

    if (data.type === "user_text") {
      onUserText?.(data.text);
    }
    
    if (data.type === "ai_text") {
      onAIText?.(data.text);
    }
    
    if (data.type === "tts_end") {
      onTTSEnd?.();
    }

  };

  ws.onerror = (err) => {
    console.error("WebSocket error", err);
  };

  ws.onclose = () => {
    console.log("WebSocket closed");
  };
}

/**
 * Send microphone PCM chunk
 */
export function sendAudioChunk(pcmChunk) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(pcmChunk); // raw ArrayBuffer
  }
}

/**
 * Submit text after enter press
 */
export function submitText() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "submit" }));
  }
}


/**
 * Signal end of microphone audio
 */
export function endAudioStream() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "audio_end" }));
  }
}

/**
 * Close session completely
 */
export function closeVoiceSession() {
  if (ws) {
    ws.close();
    ws = null;
  }
}