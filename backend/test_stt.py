from services.elevenlabs_stt import transcribe_audio

with open("test.wav", "rb") as f:
    audio = f.read()

print(transcribe_audio(audio))
