import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Conversation({ messages = [] }) {
  const bottomRef = useRef(null);

  /* AUTO-SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-3xl mt-8 space-y-4 px-2">
      <AnimatePresence>
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isError = msg.status === "error";

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ 
                layout: { duration: 0.25, ease: "easeOut" },
                opacity: { duration: 0.2 }, }}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${
                    isUser
                      ? "bg-green-500 text-black rounded-br-sm"
                      : isError
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-[#1A1A1F] text-white border border-white/5 rounded-bl-sm"
                  }
                `}
              >
                {/* MESSAGE TEXT */}
                {msg.text?.length > 0 ? (
                  msg.text
                ) : msg.status === "streaming" ? (
                  <span className="opacity-50 italic">
                    Ora is thinking…
                  </span>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* SCROLL TARGET */}
      <div ref={bottomRef} />
    </div>
  );
}