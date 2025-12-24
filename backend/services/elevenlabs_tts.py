import os
import requests
from dotenv import load_dotenv
from pathlib import Path

# FORCE load .env from backend folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

print("ENV PATH:", env_path)
print("ELEVENLABS_API_KEY:", os.getenv("ELEVENLABS_API_KEY"))
print("ELEVENLABS_VOICE_ID:", os.getenv("ELEVENLABS_VOICE_ID"))

if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not set")

if not ELEVENLABS_VOICE_ID:
    raise RuntimeError("ELEVENLABS_VOICE_ID not set")

def stream_tts(text: str):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}/stream"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = {
        "text": text,
        "model_id": "eleven_flash_v2",
        "voice_settings": {
            "stability": 0.45,
            "similarity_boost": 0.85
        }
    }

    response = requests.post(url, headers=headers, json=payload, stream=True)

    if response.status_code != 200:
        print("ElevenLabs TTS Error:", response.text)
        response.raise_for_status()

    for chunk in response.iter_content(chunk_size=4096):
        if chunk:
            yield chunk