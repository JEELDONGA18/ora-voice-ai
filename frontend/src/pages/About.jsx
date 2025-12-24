import React from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Jeel Donga",
    role: "UI / UX Engineer",
    image: "/team/jeel.jpeg",
    desc: "Designed Ora’s complete visual system, animations, and voice-first experience.",
    linkedin: "https://www.linkedin.com/in/jeel-hasmukhbhai-donga-226441290/",
  },
  {
    name: "Yash Dilkhush",
    role: "Backend / Cloud Engineer",
    image: "/team/yash.jpg",
    desc: "Handled APIs, sessions, and scalable cloud architecture.",
    linkedin: "https://www.linkedin.com/in/dilkhush-yash/",
  },
  {
    name: "Dhyey Desai",
    role: "AI / Prompt Engineer",
    image: "/team/dhyey.jpeg",
    desc: "Focused on conversational intelligence and prompt design.",
    linkedin: "https://www.linkedin.com/in/dhyey-desai-625256286/",
  },
  {
    name: "Dhrumil Khatiwala",
    role: "Voice & Audio Engineer",
    image: "/team/dhrumil.jpeg",
    desc: "Built microphone capture, waveform visualization, and audio streaming.",
    linkedin: "https://www.linkedin.com/in/dhrumil-khatiwala-4b55322b6/",
  },
];

export default function About() {
  return (
    <section className="relative min-h-screen bg-transparent backdrop-blur-sm text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-40  py-20">

        {/* ABOUT */}
        <div className="text-center">
          <h1 className="text-6xl font-semibold mb-6">
            About <span className="text-green-400">Ora</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Ora is a voice-first conversational AI designed to feel natural,
            interruptible, and human — enabling real-time speech interaction
            with intelligent, expressive AI responses.
          </p>
        </div>

        {/* TEAM */}
        <div>
          <h2 className="text-4xl font-semibold text-center mb-20">
            Meet the <span className="text-green-400">Team</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="
                  relative rounded-3xl bg-[#0F1115]
                  border border-green-400/20
                  shadow-[0_0_40px_rgba(74,222,128,0.15)]
                  p-6 text-center
                "
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-green-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm mb-4">{member.desc}</p>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center text-gray-400 hover:text-green-400"
                >
                  <Linkedin size={18} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WORKFLOW */}
        <div className="text-center space-y-16">
          <h2 className="text-5xl font-semibold">
            Workflow of <span className="text-green-400">Ora</span>
          </h2>

          {/* WORKFLOW IMAGE BOX */}
          <div className="flex justify-center">
            <div className="
              max-w-5xl w-full
              rounded-2xl bg-[#0F1115]
              border border-green-400/20
              p-6 shadow-[0_0_50px_rgba(74,222,128,0.15)]
            ">
              <img
                src="/workflow/Workflow_of_Ora.png"
                alt="Ora Architecture Workflow"
                className="w-full rounded-xl"
              />
            </div>
          </div>

          {/* WORKFLOW DETAILS */}
          <div className="max-w-4xl mx-auto text-left space-y-6 text-gray-400 leading-relaxed">
            <p><strong className="text-green-400">1. User Interaction:</strong> The user initiates voice interaction using the microphone button or spacebar.</p>
            <p><strong className="text-green-400">2. Browser Audio Capture:</strong> Audio is captured using Web Audio & MediaDevices APIs with real-time waveform feedback.</p>
            <p><strong className="text-green-400">3. Audio Processing:</strong> Speech activity and silence are analyzed to ensure clean voice input.</p>
            <p><strong className="text-green-400">4. AI Reasoning Core:</strong> Google Cloud Vertex AI / Gemini interprets intent while maintaining session context.</p>
            <p><strong className="text-green-400">5. Response Generation:</strong> Context-aware responses are generated in real time.</p>
            <p><strong className="text-green-400">6. Voice Synthesis:</strong> ElevenLabs converts AI responses into expressive, human-like speech.</p>
            <p><strong className="text-green-400">7. Streaming Playback:</strong> Audio is streamed back instantly, synchronized with chat bubbles.</p>
            <p><strong className="text-green-400">8. State Management:</strong> Ora handles interruptions, errors, and recovery seamlessly.</p>
          </div>
        </div>

        {/* CREDITS */}
        <div className="flex justify-center">
          <div className="
            max-w-4xl w-full rounded-2xl
            bg-[#0F1115]
            border border-green-400/20
            px-8 py-10 text-center
            shadow-[0_0_40px_rgba(74,222,128,0.12)]
          ">
            <h2 className="text-3xl font-semibold mb-4 pl-2 pr-2">
              Credits & Acknowledgements
            </h2>
            <p className="text-gray-400">
              Powered by <span className="text-green-400 font-medium">Google Cloud Vertex AI / Gemini</span> and
              <span className="text-green-400 font-medium"> ElevenLabs</span> for intelligent reasoning and
              natural voice synthesis.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}