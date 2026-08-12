"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeroEnvironmentalLayer from "@/components/hero/HeroEnvironmentalLayer";
import HHGoaLoader from "@/components/loading/HHGoaLoader";

export default function Home() {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <>
      {!isAppReady && <HHGoaLoader onComplete={() => setIsAppReady(true)} />}
      
      <main className="min-h-screen bg-[var(--hhg-forest)] text-[var(--hhg-cream)] relative overflow-hidden font-sans flex flex-col items-center justify-between">
        
        {/* Background Pixel Dither Layer */}
        <div className="absolute inset-0 bg-dither-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--hhg-forest)] opacity-80 pointer-events-none" />
        
        {/* Environmental Graphics Layer */}
        <HeroEnvironmentalLayer />
        
        {/* Wrapped Content for Entry Animation */}
        <div 
          className={`relative z-10 w-full flex flex-col flex-1 transition-all duration-[800ms] ease-out ${
            isAppReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Top Navigation */}
          <nav className="w-full max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8 flex justify-between items-center font-mono text-sm tracking-widest uppercase">
            <div className="flex items-center gap-2 text-[var(--hhg-lime)] font-bold text-sm sm:text-base md:text-lg leading-tight">
              2:47<span className="text-[var(--hhg-cream)]">PM</span><br/>STUDIO
            </div>
            <div className="flex items-center gap-4 md:gap-8 font-bold">
              <span className="hidden md:inline-block cursor-not-allowed opacity-50 hover:opacity-100 transition-opacity">CHECK HYPE</span>
              <Link 
                href="/generator" 
                className="bg-[var(--hhg-yellow)] text-[var(--hhg-ink)] px-4 py-2 md:px-6 md:py-2 border-2 border-[var(--hhg-pink)] shadow-[4px_4px_0_0_var(--hhg-pink)] hover:translate-y-1 hover:shadow-none transition-all text-[10px] sm:text-xs md:text-sm mr-1"
              >
                CREATE
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center pb-20">
            {/* Massive Headline */}
            <div className="relative text-center w-full px-4 flex flex-col items-center">
              <h1 className="font-serif text-[22vw] sm:text-[18vw] md:text-[12rem] lg:text-[16rem] leading-[0.85] tracking-tighter text-[var(--hhg-yellow)] drop-shadow-2xl scale-y-110">
                HACKER<br />HOUSE
              </h1>
              
              {/* Goa Sticker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 hover:rotate-0 transition-transform cursor-pointer group">
                <div className="bg-[var(--hhg-pink)] px-6 py-2 sm:px-8 sm:py-4 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-sans font-bold text-[12vw] sm:text-[10vw] md:text-8xl text-[var(--hhg-yellow)] drop-shadow-md leading-none">
                    गोवा
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Lime Bar */}
          <div className="w-full mt-auto bg-[var(--hhg-lime)] text-[var(--hhg-ink)] font-mono text-[10px] sm:text-xs md:text-sm tracking-widest font-bold py-3 md:py-4 px-4 md:px-6 relative overflow-hidden">
            {/* Scrolling or Static Bar */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-1 md:gap-2 relative z-10">
              <span>GOA, INDIA · 28 - 31 OCT 2026</span>
              <span className="hidden md:block">2:47 PM STUDIO</span>
            </div>

            {/* Decorative Dither overlay on the bar */}
            <div className="absolute inset-0 bg-dither-pattern opacity-20 pointer-events-none mix-blend-multiply z-0" />
          </div>
        </div>
      </main>
    </>
  );
}
