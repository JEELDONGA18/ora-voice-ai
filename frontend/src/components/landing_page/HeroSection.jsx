import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0B0B0F] overflow-hidden">

      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-green-400/5 blur-[140px]" />
      </div>

      <div className="relative text-center px-6">

        {/* O with Mic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex justify-center mb-12"
        >
          <div
            className="
              w-32 h-32 md:w-40 md:h-40
              rounded-full border border-green-400/40
              flex items-center justify-center
              shadow-[0_0_60px_rgba(74,222,128,0.35)]
            "
          >
            <span className="text-5xl md:text-6xl text-green-400">
              🎤
            </span>
          </div>
        </motion.div>

        {/* Meet Ora */}
        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 2,
            duration: 0.9,
            ease: "easeOut",
          }}
          className="text-5xl md:text-7xl font-semibold text-white mb-6"
        >
          Meet{" "}
          <span className="text-green-400">Ora</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 mb-12"
        >
          A calm, voice-first AI that listens and responds naturally.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/talk")}
          className="
            px-14 py-5 rounded-full
            bg-green-400 text-black
            font-semibold text-xl
            shadow-[0_0_50px_rgba(74,222,128,0.45)]
          "
        >
          Start Talking
        </motion.button>

      </div>
    </section>
  );
}