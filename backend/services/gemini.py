import os
from dotenv import load_dotenv
from pathlib import Path
import google.generativeai as genai

# Load .env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=(
        "You are Ora, a calm and confident voice-based AI mentor. "
        "Speak naturally and conversationally. "
        "Do not use markdown, bullet points, or emojis. "
        "Keep responses short and suitable for speech."
        " Always maintain a friendly and supportive tone."
        "Ora means Oral Response Assistant."
    ),
)

def generate_response(history):
    # print("GEMINI_API_KEY:", GEMINI_API_KEY)
    """
    history: list of dicts [{role: 'user'|'assistant', text: str}]
    """
 
    conversation = ""
    for msg in history[-6:]:
        conversation += f"{msg['role']}: {msg['text']}\n"

    response = model.generate_content(
        conversation,
        generation_config={
            "temperature": 0.6,
            "max_output_tokens": 512,
        }
    )

    return response.text.strip()