import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Voice-first by design",
    description:
      "Ora is built around speech — not text. Every interaction starts with your voice.",
  },
  {
    title: "Human-like responses",
    description:
      "Natural pauses, tone, and emotion make conversations feel real.",
  },
  {
    title: "Real-time conversation",
    description:
      "No waiting. Ora responds as you speak, just like a human would.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-40 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold text-white text-center mb-24"
        >
          Built for{" "}
          <span className="text-green-400">real conversation</span>
        </motion.h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="relative rounded-3xl p-8 overflow-hidden bg-[#111318]"
            >
              {/* Animated Gradient Ring */}
              <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-green-400/40 via-transparent to-green-400/40 animate-spin-slow opacity-60" />

              {/* Inner Card */}
              <div className="relative z-10 rounded-2xl bg-[#0B0B0F] p-8 h-full">

                <h3 className="text-2xl font-medium text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}