import { WS_BASE_URL } from "./apiService";

let ws = null;

/**
 * Start voice session (ONE per session)
 */
export function startVoiceSession({
  sessionId,
  onAudioChunk,
  onTTSEnd,
  onAIText,
}) {
  // ✅ prevent duplicate connections
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  ws = new WebSocket(`${WS_BASE_URL}/api/voice/${sessionId}`);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    console.log("🎤 WebSocket connected");
  };

  ws.onmessage = (event) => {
    if (event.data instanceof ArrayBuffer) {
      onAudioChunk?.(event.data);
      return;
    }

    const data = JSON.parse(event.data);

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
    console.log("🔒 WebSocket closed");
    ws = null;
  };
}

/**
 * Send incremental user text
 */
export function sendUserText(text) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  ws.send(
    JSON.stringify({
      type: "user_text",
      text,
    })
  );
}

/**
 * Submit final text
 */
export function submitText() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  ws.send(JSON.stringify({ type: "submit" }));
}

/**
 * Close session
 */
export function closeVoiceSession() {
  if (ws) {
    ws.close();
    ws = null;
  }
}