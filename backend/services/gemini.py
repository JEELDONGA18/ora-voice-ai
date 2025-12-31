import os
from dotenv import load_dotenv
from pathlib import Path
from google import genai

# Load .env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_INSTRUCTION = (
    "You are Ora, a calm and confident voice-based AI mentor. "
    "Speak naturally and conversationally. "
    "Do not use markdown, bullet points, or emojis. "
    "Keep responses short and suitable for speech. "
    "Always maintain a friendly and supportive tone. "
    "Ora means Oral Response Assistant."
)

def generate_response(history):
    contents = []

    contents.append({
        "role": "user",
        "parts": [{"text": SYSTEM_INSTRUCTION}]
    })

    for msg in history[-6:]:
        role = "user" if msg["role"] == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg["text"]}]
        })

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents
    )

    return response.text.strip()