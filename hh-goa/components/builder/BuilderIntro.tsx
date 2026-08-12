import React from "react";

export function BuilderIntro() {
  return (
    <div className="flex flex-col items-center w-full mt-4 mb-6 px-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#003F2D] font-bold mb-3 border border-[#003F2D] px-3 py-1 bg-[#F4D600] shadow-[2px_2px_0_0_#003F2D]">
        HH GOA 2026 · BUILDER ID STUDIO
      </span>
      <h1 className="font-serif text-[clamp(42px,9vw,64px)] text-[#003F2D] mb-4 tracking-tight font-bold leading-[0.9]">
        BUILD YOUR ID
      </h1>
      <p className="text-[#003F2D] font-sans text-[16px] md:text-[18px] leading-[1.4] font-medium max-w-[400px]">
        Your face. Your stack. Your Goa ID.
      </p>
    </div>
  );
}
