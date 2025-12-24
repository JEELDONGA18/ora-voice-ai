import wave
import io

def pcm_chunks_to_wav(chunks, sample_rate=16000):
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        for c in chunks:
            wf.writeframes(c)
    return buffer.getvalue()
