from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio

from services.gemini import generate_response
from services.elevenlabs_tts import stream_tts
from services.memory import get_session_memory, save_message

router = APIRouter()

@router.websocket("/voice/{session_id}")
async def voice_ws(ws: WebSocket, session_id: str):
    await ws.accept()

    try:
        while True:
            try:
                # ✅ Prevent infinite blocking (Render-safe)
                message = await asyncio.wait_for(ws.receive(), timeout=60)
            except asyncio.TimeoutError:
                # keep socket alive
                await ws.send_json({ "type": "ping" })
                continue

            if message["type"] == "websocket.disconnect":
                break

            if "text" not in message or message["text"] is None:
                continue

            data = json.loads(message["text"])

            # ❤️ heartbeat
            if data.get("type") == "ping":
                continue

            # 🎤 incremental user text
            if data.get("type") == "user_text":
                user_text = data.get("text", "").strip()
                if user_text:
                    save_message(session_id, "user", user_text)
                continue

            # ⏎ final submit
            if data.get("type") == "submit":
                history = get_session_memory(session_id)
                if not history:
                    await ws.send_json({
                        "type": "ai_text",
                        "text": "I didn’t catch that. Could you say it again?"
                    })
                    await ws.send_json({ "type": "tts_end" })
                    continue

                ai_text = generate_response(history).strip()
                if not ai_text:
                    ai_text = "I’m here. Could you rephrase that?"

                save_message(session_id, "assistant", ai_text)

                # 🧠 Send text first
                await ws.send_json({
                    "type": "ai_text",
                    "text": ai_text
                })

                # 🔊 Stream TTS
                for chunk in stream_tts(ai_text):
                    await ws.send_bytes(chunk)

                await ws.send_json({ "type": "tts_end" })

    except WebSocketDisconnect:
        # Normal client disconnect
        pass

    except Exception as e:
        # Log unexpected errors (DO NOT close socket manually)
        print("WebSocket error:", e)