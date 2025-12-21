import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Voice-first interaction",
    description:
      "Talk to Ora just like a person — natural and free.",
  },
  {
    title: "Human-like responses",
    description:
      "Real tone, human pacing, emotionally grounded replies.",
  },
  {
    title: "Real-time conversation",
    description:
      "Instant responses — as natural as a live conversation.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-40 bg-[#0B0B0F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="
                relative rounded-3xl p-8 bg-[#111318]
                backdrop-blur-xl border border-transparent
                hover:border-green-400/60
                shadow-lg shadow-green-400/20
              "
            >
              {/* Soft Glow Outline */}
              <div className="
                absolute -inset-1 rounded-3xl
                bg-gradient-to-br from-green-400/30 via-transparent to-green-400/30
                opacity-0 animate-glow
              " />

              <div className="relative z-10">
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