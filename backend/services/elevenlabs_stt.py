import os
import requests

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not ELEVENLABS_API_KEY:
    raise RuntimeError(
        "❌ ELEVENLABS_API_KEY is missing. "
        "Check Render Environment Variables."
    )

def transcribe_audio(wav_bytes: bytes) -> str:
    url = "https://api.elevenlabs.io/v1/speech-to-text"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }

    files = {
        "file": ("audio.wav", wav_bytes, "audio/wav")
    }

    data = {
        "model_id": "scribe_v1"
    }

    response = requests.post(
        url,
        headers=headers,
        files=files,
        data=data,
        timeout=30
    )

    if response.status_code != 200:
        print("❌ ElevenLabs STT Error:", response.text)
        response.raise_for_status()

    return response.json().get("text", "")