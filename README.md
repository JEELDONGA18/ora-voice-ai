# 🎙️ Ora — Voice-First Conversational AI

Ora is a **next-generation voice-driven AI experience** designed to feel **natural, interruptible, and human**.  
Built for the **ElevenLabs × Google Cloud AI Challenge**, Ora enables users to interact **entirely through speech**, combining real-time microphone input, intelligent reasoning, and expressive AI voice responses.

---

## 🌐 Live Demo & Video

- 🔗 **Live Demo:** (add link here)
- 📹 **Full Working Demo (1–2 min):** (add YouTube / Loom link here)

---

## ✨ Key Features

- 🎤 Push-to-Talk Voice Interaction (Mouse + Spacebar)
- 🧠 Context-Aware Conversational AI
- 🔊 Human-Like AI Voice (ElevenLabs)
- 📊 Real-Time Waveform Visualization
- 🔁 Interruptible Conversations
- 🎨 Dark Minimal UI with Soft Green Accents
- ⚡ Low-Latency, Session-Based Interaction

---

## 🧭 Pages Overview

### 1️⃣ Landing Page
A visually rich introduction to Ora.

**Includes:**
- Animated hero section
- Feature cards with advanced animations
- Carousel showcasing working UI videos
- Voice experience preview
- Call-to-action section
- Footer with contact & credits

---

### 2️⃣ Voice App (Working Page)
The core experience of Ora.

**Capabilities:**
- Microphone permission handling
- Push-to-talk interaction
- Dynamic waveform animations per state
- Live conversation bubbles (User ↔ AI)
- Streaming AI responses
- AI voice playback
- Error handling & recovery
- Session-aware conversation flow

---

### 3️⃣ About Page
A polished presentation of:
- Team members & roles
- Ora’s internal workflow
- Technology acknowledgements

---

## 🔄 Workflow of Ora (System Flow)

Ora follows a structured, real-time voice interaction workflow that begins with microphone permission validation, followed by continuous audio capture from the user’s device. The captured audio stream is analyzed in real time to detect speech activity and silence, after which valid speech segments are forwarded to the AI reasoning layer powered by Google Cloud Vertex AI / Gemini. The AI processes user intent within an active conversational session, preserving contextual continuity across interactions. Once a response is generated, it is passed to the voice synthesis layer using ElevenLabs, where speech is produced and streamed back to the client for immediate playback. Throughout this pipeline, Ora maintains explicit system states—Idle, Listening, Processing, Responding, and Error Handling—to ensure robust recovery from permission denials, network failures, or audio playback issues, enabling a seamless, low-latency, and fully voice-driven conversational experience.

---

## 🎛️ System States

| State | Description |
|------|------------|
| Idle | Waiting for user input |
| Listening | Capturing microphone input |
| Processing | AI reasoning in progress |
| Speaking | AI voice playback |
| Error | Permission, network, or audio failure |

Each state is visually represented using **dynamic waveform animations**.

---

## 🧑‍💻 Team

| Name | Role |
|-----|------|
| **Jeel Donga** | UI / UX Engineer — Designed the complete visual system, animations, and voice-first UX |
| **Yash Dilkhush** | Backend & Cloud Engineer — APIs, sessions, and scalable architecture |
| **Dhyey Desai** | AI & Prompt Engineer — Conversational intelligence and prompt design |
| **Dhrumil Khatiwala** | Voice & Audio Engineer — Microphone capture, waveform visualization, audio streaming |

---

## 🧠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Router

### AI & Voice
- **ElevenLabs** — AI Voice Synthesis
- **Google Cloud Vertex AI / Gemini** — Conversational Intelligence

### Browser APIs
- Web Audio API
- MediaDevices API

---

## 📂 Project Structure (Simplified)
frontend/
│
├── src/
│ ├── components/
│ │ ├── voice/
│ │ ├── layout/
│ │ └── sections/
│ ├── pages/
│ ├── hooks/
│ ├── services/
│ └── styles/
│
└── README.md

---

## 🙏 Credits & Acknowledgements

We sincerely thank:

- **Google Cloud Vertex AI / Gemini** — for powering intelligent, context-aware conversations
- **ElevenLabs** — for providing expressive, human-like AI voice synthesis

Their platforms made Ora’s natural voice experience possible.

---

## 🚀 Future Enhancements

- Live speech-to-text transcription
- True streaming audio from ElevenLabs
- Multi-language support
- Mobile-optimized voice UX
- Persistent session memory

---

## 📬 Contact & Collaboration

📧 **Email:** jeeldonga18@gmail.com  
📧 **CC:** dhyeydesai2626@gmail.com, yashdilkhush96@gmail.com  
💬 **Subject:** Collaboration with Ora or Query about Ora

---

## ⭐ Final Note

Ora is not just a demo — it is a **foundation for voice-first human–AI interaction**, designed with performance, UX, and realism in mind.