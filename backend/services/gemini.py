import os
from google.cloud import aiplatform
from services.memory import format_memory_for_prompt

aiplatform.init(project=os.getenv("GCP_PROJECT"))

def generate_response(history):
    prompt = f"""
You are Ora, a calm and confident voice-based AI mentor.
Speak naturally, conversationally, and concisely.
No lists, no markdown, no emojis.

Conversation so far:
{format_memory_for_prompt(history)}
"""

    model = aiplatform.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    return response.text.strip()
