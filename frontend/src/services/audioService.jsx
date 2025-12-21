// services/audioService.js

let audio = null;

export async function playAudioStreamFromElevenLabs(text, onEnd, onError) {
  try {
    audio = new Audio();

    const response = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();
    audio.src = URL.createObjectURL(blob);
    audio.play();

    audio.onended = onEnd;
  } catch (err) {
    onError?.(err);
  }
}

export function stopAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
