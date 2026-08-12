import React from 'react';

export default function HeroDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[3]">
      
      {/* Tiny Birds */}
      <div className="absolute top-[20%] right-[30%] opacity-60">
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M 0,10 Q 5,0 10,10 Q 15,0 20,10" fill="none" stroke="var(--hhg-cream)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-[15%] right-[25%] opacity-40 scale-75">
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M 0,10 Q 5,0 10,10 Q 15,0 20,10" fill="none" stroke="var(--hhg-cream)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-[22%] right-[20%] opacity-50 scale-50">
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M 0,10 Q 5,0 10,10 Q 15,0 20,10" fill="none" stroke="var(--hhg-cream)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Surfboard */}
      <div className="absolute bottom-[10%] right-[5%] md:bottom-20 md:right-[10%] w-12 h-32 md:w-16 md:h-48 transform rotate-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
        <svg viewBox="0 0 40 120" className="w-full h-full" aria-hidden="true">
          <path d="M 20,0 C 40,20 40,100 20,120 C 0,100 0,20 20,0 Z" fill="var(--hhg-pink)" />
          {/* Surfboard stripe */}
          <path d="M 20,0 C 25,20 25,100 20,120 C 15,100 15,20 20,0 Z" fill="var(--hhg-yellow)" />
          {/* Details */}
          <path d="M 0,60 L 40,60 M 0,70 L 40,70" stroke="var(--hhg-cream)" strokeWidth="2" />
        </svg>
      </div>

      {/* Poster Label */}
      <div className="absolute bottom-[20%] left-[10%] md:bottom-32 md:left-[25%] transform -rotate-3 hidden md:block">
        <div className="bg-[var(--hhg-yellow)] text-[var(--hhg-forest)] font-mono text-[10px] md:text-xs font-bold px-3 py-1 border-2 border-[var(--hhg-forest)] shadow-[2px_2px_0_0_var(--hhg-forest)]">
          SHIP BY SUNSET
        </div>
      </div>
    </div>
  );
}
