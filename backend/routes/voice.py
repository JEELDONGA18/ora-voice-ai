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
    await ws.send_json({ "type": "server_ready" })
    print(f"ws ready")

    try:
        while True:
            try:
                message = await asyncio.wait_for(ws.receive(), timeout=10)
            except asyncio.TimeoutError:
                # keep-alive so Render does not close socket
                await ws.send_json({"type": "ping"})
                continue

            # client disconnected
            if message["type"] == "websocket.disconnect":
                break

            # 🔊 ignore binary frames safely
            if message.get("bytes") is not None:
                continue

            # must be text frame
            if message.get("text") is None:
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
                print("✅ SUBMIT RECEIVED")
                history = get_session_memory(session_id)

                if not history:
                    await ws.send_json({
                        "type": "ai_text",
                        "text": "I didn’t catch that. Could you say it again?"
                    })
                    await ws.send_json({"type": "tts_end"})
                    continue

                ai_text = generate_response(history).strip()
                if not ai_text:
                    ai_text = "I’m here. Please try again."

                save_message(session_id, "assistant", ai_text)

                # send text first
                await ws.send_json({
                    "type": "ai_text",
                    "text": ai_text
                })

                # stream audio
                for chunk in stream_tts(ai_text):
                    await ws.send_bytes(chunk)

                await ws.send_json({"type": "tts_end"})

    except WebSocketDisconnect:
        pass

    except Exception as e:
        print("WebSocket error:", e)