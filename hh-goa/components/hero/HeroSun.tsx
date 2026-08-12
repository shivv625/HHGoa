import React from 'react';

export default function HeroSun() {
  return (
    <div className="absolute bottom-[20%] right-[5%] md:right-[15%] w-32 h-32 md:w-64 md:h-64 opacity-90 transition-transform duration-1000 ease-in-out hover:scale-105 motion-safe:animate-[subtle-scale-fade_8s_ease-in-out_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        {/* Halftone pattern definition */}
        <defs>
          <pattern id="sun-halftone" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="2" cy="2" r="1.5" fill="var(--hhg-yellow)" opacity="0.8" />
          </pattern>
        </defs>
        
        {/* Main Sun Body */}
        <circle cx="50" cy="50" r="30" fill="var(--hhg-yellow)" />
        
        {/* Outer Halftone Ring */}
        <circle cx="50" cy="50" r="45" fill="url(#sun-halftone)" />
        
        {/* Decorative Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="50"
            y1="12"
            x2="50"
            y2="4"
            stroke="var(--hhg-yellow)"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}
