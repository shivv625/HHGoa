import React from 'react';

export default function HeroWaves() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-24 md:h-48 overflow-hidden opacity-40">
      <svg className="absolute bottom-0 w-[200%] md:w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 200" aria-hidden="true">
        {/* Wave 1 */}
        <path 
          d="M0,120 C320,150 420,80 720,120 C1020,160 1120,80 1440,120 L1440,200 L0,200 Z" 
          fill="var(--hhg-lime)" 
          opacity="0.4"
        />
        {/* Wave 2 */}
        <path 
          d="M0,150 C240,120 480,180 720,150 C960,120 1200,180 1440,150 L1440,200 L0,200 Z" 
          fill="var(--hhg-lime)" 
          opacity="0.6"
        />
        {/* Wave 3 - Dotted line style for texture */}
        <path 
          d="M0,170 C400,200 800,140 1440,170" 
          fill="none" 
          stroke="var(--hhg-lime)" 
          strokeWidth="3" 
          strokeDasharray="8 8"
          opacity="0.8"
        />
        {/* Wave 4 */}
        <path 
          d="M0,190 C500,170 900,210 1440,190" 
          fill="none" 
          stroke="var(--hhg-yellow)" 
          strokeWidth="2" 
          strokeDasharray="4 12"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
