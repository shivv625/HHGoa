import React from "react";

interface BuilderTextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

export function BuilderTextField({ label, placeholder, value, onChange, maxLength }: BuilderTextFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-sans font-semibold text-[#003F2D] text-[15px]">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full h-[52px] bg-[#FFF9ED] border border-[#D8D8CC] rounded-[14px] px-[16px] font-sans text-[#003F2D] text-[15px] font-medium outline-none focus:border-[#003F2D] transition-colors placeholder:text-[#A0A0A0]"
      />
    </div>
  );
}
