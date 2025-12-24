# ELEVENLAB TESTING
# from dotenv import load_dotenv
# from pathlib import Path
# import os

# # FORCE load .env from backend folder
# env_path = Path(__file__).parent / ".env"
# load_dotenv(dotenv_path=env_path)

# print("ENV PATH:", env_path)
# print("ELEVENLABS_API_KEY:", os.getenv("ELEVENLABS_API_KEY"))

# from services.elevenlabs_stt import transcribe_audio

# with open("test.wav", "rb") as f:
#     audio = f.read()

# print(transcribe_audio(audio))


# GEMINI TESTING
from google import genai
from dotenv import load_dotenv
from pathlib import Path
import os

# FORCE load .env from backend folder
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

print("ENV PATH:", env_path)
print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say hello and confirm the API is working"
)

print(response.text)

# TTS TESTING
# from services.elevenlabs_tts import stream_tts

# output_file = "tts_test.wav"

# text = "Hello. This is Ora speaking. ElevenLabs text to speech is working correctly."

# with open(output_file, "wb") as f:
#     for chunk in stream_tts(text):
#         f.write(chunk)

# print(f"TTS audio saved as {output_file}")
