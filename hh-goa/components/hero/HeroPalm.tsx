import React from 'react';

export default function HeroPalm() {
  return (
    <div className="absolute -bottom-10 -left-10 md:-bottom-20 md:-left-10 w-72 h-96 md:w-[32rem] md:h-[40rem] z-[4] transform -rotate-6 origin-bottom-left transition-transform duration-[3000ms] hover:rotate-0">
      <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" aria-hidden="true">
        {/* Halftone Pattern */}
        <defs>
          <pattern id="palm-halftone" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="2" cy="2" r="1.5" fill="var(--hhg-forest)" opacity="0.4" />
          </pattern>
        </defs>
        
        {/* Trunk */}
        <path 
          d="M 80,300 Q 100,200 110,80 Q 90,200 65,300 Z" 
          fill="var(--hhg-yellow)" 
        />
        {/* Trunk texture */}
        <path d="M 65,300 Q 90,200 110,80 L 100,80 Q 80,200 60,300 Z" fill="url(#palm-halftone)" />

        {/* Coconuts */}
        <circle cx="95" cy="85" r="12" fill="var(--hhg-pink)" />
        <circle cx="115" cy="90" r="10" fill="var(--hhg-pink)" />
        <circle cx="105" cy="75" r="14" fill="var(--hhg-lime)" />
        
        <circle cx="95" cy="85" r="12" fill="url(#palm-halftone)" />
        <circle cx="115" cy="90" r="10" fill="url(#palm-halftone)" />

        {/* Leaves - flat solid shapes */}
        <g fill="var(--hhg-lime)">
          {/* Leaf 1 */}
          <path d="M 105,80 Q 30,70 10,120 Q 40,110 95,90 Z" />
          {/* Leaf 2 */}
          <path d="M 105,80 Q 50,20 20,40 Q 60,60 100,75 Z" />
          {/* Leaf 3 */}
          <path d="M 105,80 Q 100,10 130,5 Q 120,40 115,75 Z" />
          {/* Leaf 4 */}
          <path d="M 105,80 Q 160,20 180,50 Q 140,70 115,85 Z" />
          {/* Leaf 5 */}
          <path d="M 105,80 Q 180,90 190,140 Q 150,120 110,95 Z" />
          {/* Leaf 6 */}
          <path d="M 105,80 Q 150,150 140,190 Q 120,140 105,95 Z" />
        </g>

        {/* Leaf highlights / halftone shading */}
        <g fill="var(--hhg-yellow)">
          <path d="M 105,80 Q 50,20 20,40 Q 40,40 100,75 Z" />
          <path d="M 105,80 Q 160,20 180,50 Q 150,55 115,85 Z" />
          <path d="M 105,80 Q 180,90 190,140 Q 160,110 110,95 Z" />
        </g>
        
        <g fill="url(#palm-halftone)">
          <path d="M 105,80 Q 30,70 10,120 Q 60,90 95,90 Z" />
          <path d="M 105,80 Q 100,10 130,5 Q 110,40 115,75 Z" />
        </g>
      </svg>
    </div>
  );
}
