import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Waveform({
  mode = "listening", // listening | processing | speaking | error
  analyserRef,
  dataArrayRef,
}) {
  const BAR_COUNT = 20;
  const [levels, setLevels] = useState(
    Array(BAR_COUNT).fill(8)
  );

  /* ---------------- LISTENING (REAL MIC INPUT) ---------------- */
  useEffect(() => {
    if (mode !== "listening") return;

    let rafId;

    const update = () => {
      if (!analyserRef?.current || !dataArrayRef?.current) return;

      analyserRef.current.getByteFrequencyData(
        dataArrayRef.current
      );

      const slice = dataArrayRef.current.slice(0, BAR_COUNT);
      const normalized = Array.from(slice).map((v) =>
        Math.max(8, v / 2)
      );

      setLevels(normalized);
      rafId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(rafId);
  }, [mode, analyserRef, dataArrayRef]);

  /* ---------------- PROCESSING (BREATHING PULSE) ---------------- */
  useEffect(() => {
    if (mode !== "processing") return;

    const interval = setInterval(() => {
      setLevels((prev) =>
        prev.map(() => 10 + Math.random() * 8)
      );
    }, 400);

    return () => clearInterval(interval);
  }, [mode]);

  /* ---------------- SPEAKING (AI RESPONSE WAVE) ---------------- */
  useEffect(() => {
    if (mode !== "speaking") return;

    const interval = setInterval(() => {
      setLevels(
        Array.from({ length: BAR_COUNT }, (_, i) =>
          12 + Math.sin(Date.now() / 200 + i) * 10
        )
      );
    }, 120);

    return () => clearInterval(interval);
  }, [mode]);

  /* ---------------- ERROR (FLAT + SHAKE) ---------------- */
  useEffect(() => {
    if (mode !== "error") return;
    setLevels(Array(BAR_COUNT).fill(6));
  }, [mode]);

  /* ---------------- RENDER ---------------- */
  return (
    <motion.div
      className="flex items-end gap-1 h-14 mt-10"
      animate={
        mode === "error"
          ? { x: [0, -4, 4, -2, 2, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      {levels.map((h, i) => (
        <motion.span
          key={i}
          className={`w-1 rounded-full ${
            mode === "error"
              ? "bg-red-500"
              : "bg-green-400"
          }`}
          animate={{ height: h }}
          transition={{
            duration: mode === "listening" ? 0.1 : 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}