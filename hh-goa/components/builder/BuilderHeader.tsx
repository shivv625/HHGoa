import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BuilderHeader() {
  return (
    <header className="w-full bg-[#003F2D] border-b-[3px] border-[#F4D600] flex justify-center z-20 h-[84px] md:h-[84px]">
      <div className="w-full max-w-[1200px] px-6 py-4 flex justify-between items-center text-[#F4D600] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <div className="font-serif font-bold text-3xl tracking-tighter leading-none flex flex-col items-center relative">
              <span className="text-[#F4D600]">HACKER</span>
              <span className="text-[#F4D600]">HOUSE</span>
              <span className="text-[#FF2B83] text-[20px] font-sans absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-white/10 backdrop-blur-sm px-1 rounded shadow-sm border border-white/20">गोवा</span>
            </div>
          </Link>
          <div className="flex flex-col justify-center ml-2 border-l border-white/20 pl-4 hidden md:flex">
            <span className="font-sans font-bold text-[18px] text-[#F4D600] leading-none mb-1">HACKER GOA HOUSE</span>
            <span className="font-sans text-[12px] text-white/90 leading-none tracking-wide">Builder Social Card Generator</span>
          </div>
        </div>
        <div className="flex items-center gap-6 md:gap-8 font-mono text-[12px] tracking-widest font-bold uppercase">
          <Link href="/" className="hidden md:flex items-center gap-2 text-[#F4D600]/80 hover:text-[#F4D600] transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-[2px] transition-transform" /> HOME
          </Link>
          <div className="flex flex-col text-right text-[#F4D600] leading-none hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer">
            <span className="text-[20px] md:text-[24px] font-black tracking-tighter">2:47<span className="text-[12px] md:text-[14px]">PM</span></span>
            <span className="text-[12px] md:text-[14px] tracking-widest font-black">STUDIO</span>
          </div>
        </div>
      </div>
    </header>
  );
}
