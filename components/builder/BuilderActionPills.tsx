import React from "react";

export function BuilderActionPills() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12 font-sans text-[13px] font-bold text-[#003F2D] px-4 max-w-md mx-auto">
      <span className="bg-white px-[16px] h-[34px] rounded-full border border-[#E5E5E0] shadow-sm flex items-center justify-center gap-2">
        <span className="text-base">📸</span> Upload Photo
      </span>
      <span className="bg-white px-[16px] h-[34px] rounded-full border border-[#E5E5E0] shadow-sm flex items-center justify-center gap-2">
        <span className="text-base">⚡</span> Auto Builder
      </span>
      <span className="bg-white px-[16px] h-[34px] rounded-full border border-[#E5E5E0] shadow-sm flex items-center justify-center gap-2">
        <span className="text-base">🚀</span> Share Pass
      </span>
    </div>
  );
}
