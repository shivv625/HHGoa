import React from "react";

interface GeneratePassButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function GeneratePassButton({ onClick, disabled }: GeneratePassButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4 h-[52px] bg-[#00432F] hover:bg-[#002619] text-[#F5D900] font-bold text-[16px] rounded-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <span>Generate Pass</span>
      <span className="font-sans font-bold">→</span>
    </button>
  );
}
