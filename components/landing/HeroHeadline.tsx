"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroHeadline() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" as const }
    },
  };

  // Static fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="space-y-4 flex flex-col w-full px-4 items-center md:items-start relative z-10">
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 mb-4 self-center md:self-start">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--hhg-accent)]" />
          <p className="font-mono text-xs tracking-widest text-[var(--hhg-accent)] m-0 leading-none">28-31 OCT 2026 · GOA, INDIA</p>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-display flex flex-col items-center md:items-start">
          <span className="block">Make Your</span>
          <span className="block md:translate-x-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--hhg-sunrise-2)] via-[var(--hhg-sunrise-1)] to-[var(--hhg-sunrise-2)]">#FrameInGoa</span>
        </h1>
        
        <p className="text-[var(--hhg-sand)]/80 text-lg text-center md:text-left pt-2 max-w-sm">
          Lock in and build your legacy. Generate your official builder badge.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 flex flex-col w-full px-4 items-center md:items-start relative z-10"
    >
      <motion.div variants={item} className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 mb-4 self-center md:self-start">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--hhg-accent)] animate-[live-pulse_2s_infinite]" />
        <p className="font-mono text-xs tracking-widest text-[var(--hhg-accent)] m-0 leading-none">28-31 OCT 2026 · GOA, INDIA</p>
      </motion.div>
      
      <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-display flex flex-col items-center md:items-start">
        <motion.span variants={item} className="block">Make Your</motion.span>
        <motion.span variants={item} className="block md:translate-x-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--hhg-sunrise-2)] via-[var(--hhg-sunrise-1)] to-[var(--hhg-sunrise-2)] animate-gradient-pan">
          #FrameInGoa
        </motion.span>
      </h1>
      
      <motion.p variants={item} className="text-[var(--hhg-sand)]/80 text-lg text-center md:text-left pt-2 max-w-sm">
        Lock in and build your legacy. Generate your official builder badge.
      </motion.p>
    </motion.div>
  );
}
