import os
import requests

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

def transcribe_audio(wav_bytes: bytes) -> str:
    url = "https://api.elevenlabs.io/v1/speech-to-text"
    print("API KEY LOADED:", ELEVENLABS_API_KEY[:5])

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }

    # IMPORTANT: field name MUST be "file"
    files = {
        "file": ("success.wav", wav_bytes, "audio/wav")
    }

    # model_id MUST be in data, not files
    data = {
        "model_id": "scribe_v1"
    }

    response = requests.post(
        url,
        headers=headers,
        files=files,
        data=data
    )

    if response.status_code != 200:
        print("ElevenLabs STT Error:", response.text)
        response.raise_for_status()
    return response.json()["text"]
