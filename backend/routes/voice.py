from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

from services.gemini import generate_response
from services.elevenlabs_tts import stream_tts
from services.memory import get_session_memory, save_message

router = APIRouter()

@router.websocket("/voice/{session_id}")
async def voice_ws(ws: WebSocket, session_id: str):
    await ws.accept()

    try:
        while True:
            message = await ws.receive()

            if message["type"] == "websocket.disconnect":
                break

            if "text" not in message or message["text"] is None:
                continue

            data = json.loads(message["text"])

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
                    continue

                ai_text = generate_response(history)
                save_message(session_id, "assistant", ai_text)

                await ws.send_json({
                    "type": "ai_text",
                    "text": ai_text
                })

                for chunk in stream_tts(ai_text):
                    await ws.send_bytes(chunk)

                await ws.send_json({ "type": "tts_end" })

    except WebSocketDisconnect:
        # ✅ normal disconnect — DO NOTHING
        pass

    except Exception as e:
        # ✅ log real errors
        print("WebSocket error:", e)