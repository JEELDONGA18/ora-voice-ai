import wave
import io

def pcm_chunks_to_wav(pcm_chunks, sample_rate=16000):
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(b"".join(pcm_chunks))
    buffer.seek(0)
    return buffer