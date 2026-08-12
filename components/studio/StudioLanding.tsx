"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { convertHeicToJpeg } from "@/lib/heic";

interface StudioLandingProps {
  onImageSelected: (url: string) => void;
}

export function StudioLanding({ onImageSelected }: StudioLandingProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const blob = await convertHeicToJpeg(file);
      onImageSelected(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Error processing image:", err);
      alert("Failed to process image. Try another one.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,69,0.15),transparent_70%)] pointer-events-none -z-10" />
      
      <div className="flex flex-col md:flex-row items-center w-full gap-12 lg:gap-24">
        {/* Left Editorial Copy */}
        <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
          <div className="flex flex-col">
            <span className="font-mono text-[var(--hhg-accent)] text-sm tracking-widest uppercase mb-4">HH Goa 2026</span>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[0.9] tracking-tight">
              BUILDER<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--hhg-sunrise-2)] to-[var(--hhg-sunrise-1)]">ID STUDIO</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-[var(--hhg-sand)]/70 max-w-md mx-auto md:mx-0 font-sans font-medium">
            Make your signal visible. A visual identity tool for people who build.
          </p>

          <div className="hidden md:flex flex-col gap-2 mt-8">
            <span className="font-mono text-xs text-[var(--hhg-sand)]/40 uppercase tracking-widest">LESS NOISE.</span>
            <span className="font-mono text-xs text-[var(--hhg-sand)]/40 uppercase tracking-widest">MORE SIGNAL.</span>
          </div>
        </div>

        {/* Right Upload Action */}
        <div className="flex-1 w-full max-w-sm flex flex-col items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-full aspect-square md:aspect-[4/5] bg-black/40 hover:bg-black/60 border border-[var(--hhg-sand)]/10 hover:border-[var(--hhg-accent)]/50 rounded-none transition-all flex flex-col items-center justify-center gap-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--hhg-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 rounded-full border border-[var(--hhg-sand)]/20 flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--hhg-accent)] transition-all">
              <Upload className="text-[var(--hhg-sand)] group-hover:text-[var(--hhg-accent)] transition-colors" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="font-display font-bold tracking-widest text-xl">UPLOAD PHOTO</span>
              <span className="font-mono text-[9px] text-[var(--hhg-sand)]/50 tracking-widest uppercase">JPG · PNG · HEIC · WEBP</span>
            </div>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
