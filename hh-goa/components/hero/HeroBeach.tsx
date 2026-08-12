import React from 'react';

export default function HeroBeach() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 z-[-1] opacity-30">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        {/* Distant sand bank */}
        <path d="M0,100 L0,70 Q25,60 50,80 T100,60 L100,100 Z" fill="var(--hhg-lime)" />
        {/* Closer sand bank */}
        <path d="M0,100 L0,85 Q30,75 70,95 T100,85 L100,100 Z" fill="var(--hhg-yellow)" opacity="0.4" />
      </svg>
    </div>
  );
}
