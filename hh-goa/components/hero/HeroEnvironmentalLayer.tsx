import React from 'react';
import HeroSun from './HeroSun';
import HeroPalm from './HeroPalm';
import HeroWaves from './HeroWaves';
import HeroBeach from './HeroBeach';
import HeroDecorations from './HeroDecorations';

export default function HeroEnvironmentalLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Background/distant elements */}
      <HeroSun />
      
      {/* Midground */}
      <HeroBeach />
      <HeroWaves />
      
      {/* Foreground/corner elements */}
      <HeroDecorations />
      <HeroPalm />
    </div>
  );
}
