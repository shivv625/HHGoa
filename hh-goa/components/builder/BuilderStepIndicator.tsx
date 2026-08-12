import React from "react";

interface BuilderStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function BuilderStepIndicator({ currentStep }: BuilderStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-[400px] mx-auto mb-8 font-mono text-[11px] md:text-xs font-bold uppercase tracking-widest text-[#003F2D]">
      
      {/* Step 1 */}
      <div className={`flex items-center transition-opacity ${currentStep >= 1 ? "opacity-100" : "opacity-40"}`}>
        <span className={currentStep === 1 ? "bg-[#003F2D] text-[#F4D600] px-2 py-1" : ""}>
          01 PHOTO
        </span>
      </div>

      {/* Line 1 */}
      <div className={`flex-1 h-[2px] mx-2 transition-opacity border-t-2 border-dashed border-[#003F2D] ${currentStep >= 2 ? "opacity-100" : "opacity-20"}`} />

      {/* Step 2 */}
      <div className={`flex items-center transition-opacity ${currentStep >= 2 ? "opacity-100" : "opacity-40"}`}>
        <span className={currentStep === 2 ? "bg-[#003F2D] text-[#F4D600] px-2 py-1" : ""}>
          02 DETAILS
        </span>
      </div>

      {/* Line 2 */}
      <div className={`flex-1 h-[2px] mx-2 transition-opacity border-t-2 border-dashed border-[#003F2D] ${currentStep === 3 ? "opacity-100" : "opacity-20"}`} />

      {/* Step 3 */}
      <div className={`flex items-center transition-opacity ${currentStep === 3 ? "opacity-100" : "opacity-40"}`}>
        <span className={currentStep === 3 ? "bg-[#003F2D] text-[#F4D600] px-2 py-1" : ""}>
          03 BUILD
        </span>
      </div>

    </div>
  );
}
