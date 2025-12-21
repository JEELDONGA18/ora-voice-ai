import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-40 bg-[#0B0B0F] overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[600px] h-[600px] bg-green-400/15 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-semibold text-white mb-8"
        >
          Ready to{" "}
          <span className="text-green-400">talk</span> to Ora?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-400 mb-14"
        >
          Experience a new kind of conversation — natural, real-time, and human.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/talk")}
          className="
            px-14 py-6 rounded-full
            bg-green-400 text-black
            font-semibold text-xl
            shadow-[0_0_60px_rgba(74,222,128,0.45)]
          "
        >
          Start Talking
        </motion.button>

      </div>
    </section>
  );
}