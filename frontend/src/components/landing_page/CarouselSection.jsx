import React from "react";
import { motion } from "framer-motion";

const items = [
  {
    title: "Natural conversation",
    video: "/videos/voice-demo.mp4",
  },
  {
    title: "Real-time response",
    video: "/videos/realtime-demo.mp4",
  },
  {
    title: "Human-like voice",
    video: "/videos/chat-demo.mp4",
  },
];

export default function CarouselSection() {
  return (
    <section className="relative py-32 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold text-white mb-16"
        >
          See Ora in{" "}
          <span className="text-green-400">motion</span>.
        </motion.h2>

        {/* Video Carousel */}
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">

          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="
                min-w-[300px] md:min-w-[420px] h-[240px]
                rounded-2xl relative overflow-hidden
                bg-black
                shadow-[0_0_40px_rgba(0,0,0,0.6)]
              "
            >
              {/* Video */}
              <video
                src={item.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-white text-lg font-medium">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}