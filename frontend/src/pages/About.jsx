import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Jeel Donga",
    role: "UI / UX Engineer",
    image: "/team/jeel.jpeg",
    desc: "Designed Ora’s complete visual system, animations, and voice-first experience.",
    linkedin: "#",
  },
  {
    name: "Yash Dilkhush",
    role: "Backend / Cloud Engineer",
    image: "/team/yash.jpg",
    desc: "Handled APIs, sessions, and scalable cloud architecture.",
    linkedin: "#",
  },
  {
    name: "Dhyey Desai",
    role: "AI / Prompt Engineer",
    image: "/team/dhyey.jpeg",
    desc: "Focused on conversational intelligence and prompt design.",
    linkedin: "#",
  },
  {
    name: "Dhrumil Khatiwala",
    role: "Voice & Audio Engineer",
    image: "/team/dhrumil.jpeg",
    desc: "Built microphone capture, waveform visualization, and audio streaming.",
    linkedin: "#",
  },
];

export default function About() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  /* CURSOR GLOW TRACKING */
  useEffect(() => {
    const move = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0B0B0F] text-white py-16 overflow-hidden">

      {/* CURSOR GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px at ${cursor.x}px ${cursor.y}px, rgba(74,222,128,0.12), transparent 80%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-40">

        {/* ABOUT */}
        <div className="text-center">
          <h1 className="text-6xl font-semibold mb-6">
            About <span className="text-green-400">Ora</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Ora is a voice-first AI experience designed to feel natural,
            interruptible, and human.
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
                  className="inline-flex justify-center text-gray-400 hover:text-green-400"
                >
                  <Linkedin size={18} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NEXT-LEVEL WORKFLOW */}
        <div className="relative text-center py-20">
          <h2 className="text-5xl font-semibold mb-20">
            Workflow of <span className="text-green-400">Ora</span>
          </h2>

          <motion.svg
            viewBox="0 0 600 700"
            className="mx-auto w-full max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* SIGNAL PATH */}
            <motion.path
              d="M300 80 L300 620"
              stroke="url(#signalGradient)"
              strokeWidth="3"
              strokeDasharray="8 8"
              fill="none"
              variants={{
                hidden: { pathLength: 0 },
                visible: { pathLength: 1 },
              }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />

            {/* GRADIENT */}
            <defs>
              <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* STEPS */}
            {[
              { label: "User Speaks", y: 80 },
              { label: "Audio Capture", y: 180 },
              { label: "AI Core", y: 350, core: true },
              { label: "Voice Synthesis", y: 520 },
              { label: "Response Playback", y: 620 },
            ].map((step, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.25 }}
              >
                {/* CORE GLOW */}
                {step.core && (
                  <motion.circle
                    cx="300"
                    cy={step.y}
                    r="60"
                    fill="#4ade80"
                    opacity="0.12"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* NODE */}
                <circle
                  cx="300"
                  cy={step.y}
                  r={step.core ? 18 : 10}
                  fill="#4ade80"
                />

                {/* LABEL */}
                <text
                  x="300"
                  y={step.y - (step.core ? 80 : 30)}
                  textAnchor="middle"
                  fill="#d1d5db"
                  fontSize="16"
                  fontWeight={step.core ? "600" : "400"}
                >
                  {step.label}
                </text>
              </motion.g>
            ))}
          </motion.svg>

          {/* DESCRIPTION */}
          <p className="mt-20 max-w-2xl mx-auto text-gray-400">
            Ora listens, understands, and responds in real time — allowing
            natural interruptions and human-like conversation flow.
          </p>
        </div>

        {/* CREDITS */}
        <div className="flex justify-center">
          <div
            className="
              max-w-4xl w-full
              rounded-2xl
              bg-[#0F1115]
              border border-green-400/20
              px-8 py-10
              text-center
              shadow-[0_0_40px_rgba(74,222,128,0.12)]
            "
          >
            <h2 className="text-3xl font-semibold mb-4">
              Credits & Acknowledgements
            </h2>

            <p className="text-gray-400 leading-relaxed">
              We sincerely thank{" "}
              <span className="text-green-400 font-medium">
                Google Cloud Vertex AI
              </span>{" "}
              and{" "}
              <span className="text-green-400 font-medium">
                ElevenLabs
              </span>{" "}
              for powering Ora with world-class AI intelligence and
              natural voice synthesis technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}