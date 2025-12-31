import { WS_BASE_URL } from "./apiService";

let ws = null;
let heartbeatTimer = null;
let lastConfig = null;

/**
 * Start voice session (ONE per session)
 * - Keeps socket alive on Render
 * - Auto-reconnects if dropped
 */
export function startVoiceSession({
  sessionId,
  onAudioChunk,
  onTTSEnd,
  onAIText,
}) {
  // Save config for auto-reconnect
  lastConfig = { sessionId, onAudioChunk, onTTSEnd, onAIText };

  // ✅ prevent duplicate connections
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  ws = new WebSocket(`${WS_BASE_URL}/api/voice/${sessionId}`);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    console.log("🎤 WebSocket connected");

    // ✅ HEARTBEAT (Render kills idle sockets)
    heartbeatTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 20000); // every 20s
  };

  ws.onmessage = (event) => {
    // 🔊 Binary TTS audio
    if (event.data instanceof ArrayBuffer) {
      onAudioChunk?.(event.data);
      return;
    }

    // 📩 JSON message
    const data = JSON.parse(event.data);

    // ✅ RENDER HANDSHAKE (NEW)
    if (data.type === "server_ready") {
      console.log("✅ Server ready (WS handshake complete)");
      return;
    }

    if (data.type === "ai_text") {
      onAIText?.(data.text);
      return;
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error", err);
    ws?.close();
  };

  ws.onclose = () => {
    console.log("🔒 WebSocket closed");

    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    ws = null;

    // ✅ AUTO-RECONNECT (Render / network hiccups)
    if (lastConfig) {
      setTimeout(() => {
        startVoiceSession(lastConfig);
      }, 1000);
    }
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
 * Submit final text (Enter key)
 */
export function submitText() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "submit" }));
    return;
  }

  // 🧠 wait for socket to open
  const waitAndSubmit = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "submit" }));
      clearInterval(waitAndSubmit);
    }
  }, 50);

  // safety timeout
  setTimeout(() => clearInterval(waitAndSubmit), 3000);
}

/**
 * Close session completely
 */
export function closeVoiceSession() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  if (ws) {
    ws.close();
    ws = null;
  }

  lastConfig = null;
}