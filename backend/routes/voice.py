from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json, os

from services.elevenlabs_stt import transcribe_audio
from services.gemini import generate_response
from services.elevenlabs_tts import stream_tts
from services.memory import get_session_memory, save_message
from utils.audio import pcm_chunks_to_wav

router = APIRouter()

@router.websocket("/voice/{session_id}")
async def voice_ws(ws: WebSocket, session_id: str):
    await ws.accept()

    audio_chunks: list[bytes] = []

    try:
        while True:
            print("ELEVENLABS_API_KEY loaded:", bool(os.getenv("ELEVENLABS_API_KEY")))
            
            message = await ws.receive()

            # 🔌 client disconnected
            if message["type"] == "websocket.disconnect":
                print("🔌 websocket disconnect")
                break

            # 🎧 binary audio
            if "bytes" in message and message["bytes"] is not None:
                audio_chunks.append(message["bytes"])
                continue

            # 📩 json message
            if "text" in message and message["text"] is not None:
                data = json.loads(message["text"])

                # 🛑 SPACE RELEASE → STT ONLY
                if data.get("type") == "audio_end":
                    print("🛑 audio_end received → STT only")

                    if not audio_chunks:
                        await ws.send_json({
                            "type": "user_text",
                            "text": ""
                        })
                        continue

                    wav_bytes = pcm_chunks_to_wav(audio_chunks)
                    user_text = transcribe_audio(wav_bytes)

                    save_message(session_id, "user", user_text)

                    await ws.send_json({
                        "type": "user_text",
                        "text": user_text
                    })

                    # reset buffer for next recording
                    audio_chunks.clear()
                    continue

                # ✅ ENTER KEY → SUBMIT TO AI
                if data.get("type") == "submit":
                    print("🚀 submit received → AI + TTS")

                    history = get_session_memory(session_id)
                    ai_text = generate_response(history)

                    save_message(session_id, "assistant", ai_text)

                    await ws.send_json({
                        "type": "ai_text",
                        "text": ai_text
                    })

                    # 🔊 stream TTS
                    for chunk in stream_tts(ai_text):
                        await ws.send_bytes(chunk)

                    await ws.send_json({ "type": "tts_end" })
                    continue

    except WebSocketDisconnect:
        print("🔌 client disconnected (exception)")

    finally:
        await ws.close()
        print("🔒 websocket closed")