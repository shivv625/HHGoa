"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FallbackOrb() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute top-[10%] right-[10%] md:right-[20%] w-64 h-64 md:w-96 md:h-96 -z-10 pointer-events-none"
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-full h-full rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--hhg-sunrise-2) 0%, var(--hhg-sunrise-1) 50%, transparent 80%)",
          filter: "blur(20px)",
        }}
      >
        {/* Fake specular highlight */}
        <div
          className="absolute top-[20%] left-[20%] w-[20%] h-[20%] rounded-full bg-white opacity-40 mix-blend-overlay"
          style={{ filter: "blur(10px)" }}
        />
      </motion.div>
    </motion.div>
  );
}
