"use client";

import React from "react";

interface StudioControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  name: string;
  setName: (name: string) => void;
  stack: string;
  setStack: (stack: string) => void;
}

export function StudioControls({ zoom, setZoom, name, setName, stack, setStack }: StudioControlsProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-sm">
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center justify-between text-[var(--hhg-sand)]/60 text-[10px] font-mono tracking-widest uppercase mb-1">
          <span>Scale</span>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer outline-none slider-thumb-hhg"
          style={{
            backgroundImage: `linear-gradient(var(--hhg-accent), var(--hhg-accent))`,
            backgroundSize: `${((zoom - 1) / 2) * 100}% 100%`,
            backgroundRepeat: "no-repeat"
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          .slider-thumb-hhg::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            background: var(--hhg-accent);
            border-radius: 50%;
            cursor: pointer;
          }
        `}} />
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-mono text-xs text-[var(--hhg-sand)]/50 tracking-widest uppercase">Builder Identity</h3>
        
        <div className="flex flex-col gap-2 relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="NAME"
            className="bg-transparent border-b border-white/10 p-2 pl-0 text-[var(--hhg-sand)] font-display font-medium text-lg outline-none focus:border-[var(--hhg-accent)] transition-colors placeholder:text-white/20"
            maxLength={30}
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <input
            type="text"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            placeholder="STACK / ROLE"
            className="bg-transparent border-b border-white/10 p-2 pl-0 text-[var(--hhg-sand)] font-mono text-sm outline-none focus:border-[var(--hhg-accent)] transition-colors placeholder:text-white/20"
            maxLength={40}
          />
        </div>
      </div>
    </div>
  );
}
