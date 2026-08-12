"use client";

import React, { useEffect, useState } from "react";

interface HHGoaLoaderProps {
  onComplete: () => void;
}

export default function HHGoaLoader({ onComplete }: HHGoaLoaderProps) {
  const [stage, setStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    let timeouts: NodeJS.Timeout[] = [];

    if (mediaQuery.matches) {
      // Reduced motion: skip staggered sequence and show "READY TO BUILD" almost immediately
      setStage(4);
      timeouts.push(
        setTimeout(() => setIsFadingOut(true), 800),
        setTimeout(() => onComplete(), 1400) // Fast exit
      );
    } else {
      // Normal sequence:
      // 0ms: bg (stage 0)
      // 200ms: 2:47 PM STUDIO (stage 1)
      // 400ms: HACKER HOUSE + GOA (stage 2)
      // 600ms: Progress indicator / Booting text (stage 3)
      // 1200ms: READY TO BUILD (stage 4)
      // 1800ms: Fade out
      // 2300ms: Unmount
      timeouts.push(
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 400),
        setTimeout(() => setStage(3), 600),
        setTimeout(() => setStage(4), 1200),
        setTimeout(() => setIsFadingOut(true), 1800),
        setTimeout(() => onComplete(), 2300) // 500ms for fade out
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--hhg-forest)] text-[var(--hhg-yellow)] transition-opacity duration-500 ease-in-out selection:bg-[#F4D600] selection:text-[#003F2D] ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Layer matching the actual app bg */}
      <div className="absolute inset-0 bg-dither-pattern opacity-40 pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-sm">
        
        {/* Tiny Sun Decorative */}
        <div 
          className={`w-12 h-12 rounded-full bg-[var(--hhg-yellow)] mb-8 transition-all duration-700 ease-out ${
            stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`} 
        />

        {/* 2:47 PM STUDIO */}
        <div
          className={`font-mono text-xs tracking-widest uppercase font-bold text-[var(--hhg-lime)] mb-12 text-center transition-all duration-700 ease-out transform ${
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          2:47<span className="text-[var(--hhg-cream)]">PM</span><br/>STUDIO
        </div>

        {/* Main Branding */}
        <div
          className={`relative text-center w-full transition-all duration-700 ease-out transform ${
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="font-serif text-[18vw] sm:text-[14vw] md:text-7xl leading-[0.85] tracking-tighter drop-shadow-xl scale-y-110">
            HACKER<br />HOUSE
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12">
            <div className="bg-[var(--hhg-pink)] px-4 py-2 rounded-xl border-2 border-white shadow-xl flex items-center justify-center">
              <span className="font-sans font-bold text-3xl text-[var(--hhg-yellow)] leading-none">
                गोवा
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className={`w-full max-w-[200px] h-[2px] border-b-2 border-dashed border-[var(--hhg-yellow)]/30 my-10 transition-all duration-700 ${
            stage >= 3 ? "opacity-100 w-full" : "opacity-0 w-0"
          }`}
        />

        {/* Status Text & Progress */}
        <div 
          className={`flex flex-col items-center gap-4 transition-all duration-500 w-full ${
            stage >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--hhg-cream)]/70">
            {stage === 4 ? "READY TO BUILD." : "BOOTING BUILDER MODE..."}
          </span>
          
          <div className="w-[160px] h-[4px] bg-[var(--hhg-dark-green)] rounded-full overflow-hidden relative">
            <div 
              className={`absolute top-0 left-0 h-full bg-[var(--hhg-pink)] transition-all duration-1000 ease-in-out ${
                stage === 4 ? "w-full" : "w-[60%]"
              }`}
            />
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div 
        className={`absolute bottom-8 font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--hhg-lime)]/50 transition-opacity duration-1000 flex flex-col items-center gap-2 ${
          stage >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>GOA, INDIA · 28—31 OCT 2026</span>
        <span>BUILD · SHIP · REPEAT</span>
      </div>

    </div>
  );
}
