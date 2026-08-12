import React from "react";

export function BuilderActionPills() {
  return (
    <div className="flex flex-wrap justify-center gap-[10px] mb-12 font-sans text-[13px] font-bold text-[#003F2D] px-4 max-w-md mx-auto">
      <span className="bg-white hover:bg-[#FDFDFD] active:bg-[#F3F4F0] px-[16px] h-[34px] rounded-full border border-[#E5E5E0] hover:border-[#D1D1C8] shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-all flex items-center justify-center gap-2 cursor-pointer">
        <span className="text-[15px]">📸</span> Upload Photo
      </span>
      <span className="bg-white hover:bg-[#FDFDFD] active:bg-[#F3F4F0] px-[16px] h-[34px] rounded-full border border-[#E5E5E0] hover:border-[#D1D1C8] shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-all flex items-center justify-center gap-2 cursor-pointer">
        <span className="text-[15px]">⚡</span> Auto Builder
      </span>
      <span className="bg-white hover:bg-[#FDFDFD] active:bg-[#F3F4F0] px-[16px] h-[34px] rounded-full border border-[#E5E5E0] hover:border-[#D1D1C8] shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition-all flex items-center justify-center gap-2 cursor-pointer">
        <span className="text-[15px]">🚀</span> Share Pass
      </span>
    </div>
  );
}
