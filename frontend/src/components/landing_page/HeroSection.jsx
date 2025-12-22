import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FULL_FORM = "Oral Responsive Assistant";

export default function HeroSection() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  /* TYPEWRITER EFFECT */
  useEffect(() => {
    const speed = isDeleting ? 40 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting && index < FULL_FORM.length) {
        setText(FULL_FORM.slice(0, index + 1));
        setIndex(index + 1);
      } 
      else if (isDeleting && index > 0) {
        setText(FULL_FORM.slice(0, index - 1));
        setIndex(index - 1);
      } 
      else if (!isDeleting && index === FULL_FORM.length) {
        setTimeout(() => setIsDeleting(true), 1200);
      } 
      else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  return (
    <section className="relative min-h-screen bg-[#0B0B0F] overflow-hidden flex items-center">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-green-400/5 blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-20">

          {/* LEFT — MIC ORB */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex justify-center md:justify-start"
          >
            <div
              className="
                w-40 h-40 md:w-52 md:h-52
                rounded-full
                border border-green-400/40
                flex items-center justify-center
                shadow-[0_0_80px_rgba(74,222,128,0.45)]
                bg-[#0F1115]
              "
            >
              <span className="text-6xl md:text-7xl text-green-400">
                🎤
              </span>
            </div>
          </motion.div>

          {/* RIGHT — TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            {/* ORA */}
            <h1 className="text-6xl md:text-8xl font-semibold text-white mb-3">
              ORA
            </h1>

            {/* TYPEWRITER FULL FORM */}
            <p className="text-green-400 text-3xl md:text-xl tracking-wide h-8 mb-6">
              {text}
              <span className="animate-pulse">|</span>
            </p>

            {/* SUBTITLE */}
            <p className="max-w-xl text-gray-400 text-lg md:text-xl mb-10">
              A calm, voice-first AI designed for natural,
              interruptible, human conversation.
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/talk")}
              className="
                inline-flex items-center justify-center
                px-14 py-5 rounded-full
                bg-green-400 text-black
                font-semibold text-xl
                shadow-[0_0_60px_rgba(74,222,128,0.45)]
              "
            >
              Start Talking
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}