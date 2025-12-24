from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.elevenlabs_stt import transcribe_audio
from services.gemini import generate_response
from services.elevenlabs_tts import stream_tts
from services.memory import (
    get_session_memory,
    save_message
)
from utils.audio import pcm_chunks_to_wav

router = APIRouter()

@router.websocket("/voice/{session_id}")
async def voice_ws(ws: WebSocket, session_id: str):
    await ws.accept()
    audio_chunks = []

    try:
        while True:
            msg = await ws.receive_json()

            if msg["type"] == "audio_chunk":
                audio_chunks.append(bytes(msg["data"]))

            elif msg["type"] == "end_of_utterance":
                # 1️⃣ Audio → Text
                wav_bytes = pcm_chunks_to_wav(audio_chunks)
                user_text = transcribe_audio(wav_bytes)

                save_message(session_id, "user", user_text)

                # 2️⃣ Gemini reasoning
                history = get_session_memory(session_id)
                ai_text = generate_response(history)

                save_message(session_id, "assistant", ai_text)

                # 3️⃣ Stream TTS back
                async for chunk in stream_tts(ai_text):
                    await ws.send_bytes(chunk)

                await ws.send_json({"type": "tts_end"})
                audio_chunks = []

    except WebSocketDisconnect:
        print("Client disconnected")
