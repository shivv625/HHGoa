import React from "react";

interface GeneratePassButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating?: boolean;
}

export function GeneratePassButton({ onClick, disabled, isGenerating }: GeneratePassButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || isGenerating}
      className="w-full h-[56px] bg-[#003F2D] hover:bg-[#002619] active:bg-[#001c12] text-[#F4D600] font-mono font-bold text-[14px] md:text-[16px] uppercase tracking-widest border-2 border-[#003F2D] shadow-[4px_4px_0_0_#003F2D] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#003F2D] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[4px_4px_0_0_#003F2D] flex items-center justify-center gap-2 group"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-[#003F2D] border-t-[#F4D600] rounded-full mr-2" />
          <span>BUILDING YOUR ID...</span>
        </>
      ) : (
        <>
          <span>BUILD MY ID</span>
          <span className="font-sans font-bold transition-transform duration-300 group-hover:translate-x-[4px]">→</span>
        </>
      )}
    </button>
  );
}
