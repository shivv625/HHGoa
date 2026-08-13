"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { Area, Point } from "react-easy-crop";
import { BuilderPhotoUpload } from "./BuilderPhotoUpload";
import { BuilderTextField } from "./BuilderTextField";
import { GeneratePassButton } from "./GeneratePassButton";

interface BuilderFormProps {
  onNext: (data: { imageUrl: string; cropPixels: Area; name: string; stack: string; xHandle: string; mode: "pfp" | "id" }) => void;
  isGenerating?: boolean;
  onStepChange?: (step: 1 | 2 | 3) => void;
}

export function BuilderForm({ onNext, isGenerating, onStepChange }: BuilderFormProps) {
  const [mode, setMode] = useState<"pfp" | "id">("id");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  // Auto step tracking
  useEffect(() => {
    if (onStepChange) {
      if (imageUrl && (mode === "pfp" || name || stack)) {
        onStepChange(3);
      } else if (imageUrl) {
        onStepChange(2);
      } else {
        onStepChange(1);
      }
    }
  }, [imageUrl, name, stack, mode, onStepChange]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const normalizeXHandle = (val: string) => {
    let clean = val.trim();
    // Strip URLs
    clean = clean.replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i, '');
    clean = clean.replace(/[^a-zA-Z0-9_@]/g, '');
    // Ensure single leading @
    if (clean && !clean.startsWith('@')) clean = '@' + clean;
    clean = clean.replace(/^@+/, '@'); // Fix multiple @
    return clean;
  };

  const handleXHandleChange = (val: string) => {
    setXHandle(val); // update raw value as they type
  };

  const handleXHandleBlur = () => {
    if (xHandle) {
      const normalized = normalizeXHandle(xHandle);
      if (normalized.length > 16) {
        setXHandle(normalized.substring(0, 16)); // Max 15 chars + @
      } else {
        setXHandle(normalized);
      }
    }
  };

  const handleGenerate = () => {
    if (!imageUrl || !cropPixels || isGenerating) return;
    
    let finalXHandle = xHandle;
    if (mode === "id") {
      if (!name || !xHandle) return; // name and xHandle are required
      finalXHandle = normalizeXHandle(xHandle);
      if (finalXHandle.length > 16) finalXHandle = finalXHandle.substring(0, 16);
    }
    
    onNext({ imageUrl, cropPixels, name, stack, xHandle: finalXHandle, mode });
  };

  const clearPhoto = () => {
    setImageUrl(null);
    setCropPixels(null);
  };

  return (
    <div className="w-full max-w-[680px] mx-auto bg-[#FFFDF5] border-2 border-[#003F2D] shadow-[8px_8px_0_0_#003F2D] flex flex-col relative z-10 p-0 overflow-hidden">
      
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#003F2D] bg-[#F4D600] px-4 py-3 gap-3">
        <div className="flex flex-col text-center sm:text-left">
          <span className="font-mono text-xs font-bold tracking-widest text-[#003F2D]">BUILDER STUDIO</span>
          <span className="font-sans text-[11px] font-medium text-[#003F2D] opacity-80">Choose format and create your identity.</span>
        </div>

        {/* MODE TOGGLE */}
        <div className="flex items-center bg-white border-2 border-[#003F2D] p-1 font-sans text-[10px] font-bold tracking-widest uppercase">
          <button 
            onClick={() => setMode("id")}
            className={`px-3 py-1.5 transition-colors ${mode === "id" ? "bg-[#003F2D] text-[#F4D600]" : "bg-transparent text-[#003F2D] hover:bg-gray-100"}`}
          >
            Builder ID
          </button>
          <button 
            onClick={() => setMode("pfp")}
            className={`px-3 py-1.5 transition-colors ${mode === "pfp" ? "bg-[#003F2D] text-[#F4D600]" : "bg-transparent text-[#003F2D] hover:bg-gray-100"}`}
          >
            PFP Overlay
          </button>
        </div>
      </div>

      <div className="p-[24px] md:p-[32px] flex flex-col">
        {/* SECTION: YOUR PHOTO */}
        <div className="flex flex-col gap-4">
          <h2 className="font-mono font-bold text-[12px] text-[#003F2D] tracking-widest uppercase border-b-2 border-dashed border-[#003F2D] pb-2">
            01 / YOUR PHOTO
          </h2>
          <BuilderPhotoUpload 
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            clearPhoto={clearPhoto}
          />
        </div>

        {/* SECTION: YOUR DETAILS */}
        {mode === "id" && (
          <div className="flex flex-col gap-4 mt-8">
            <h2 className="font-mono font-bold text-[12px] text-[#003F2D] tracking-widest uppercase border-b-2 border-dashed border-[#003F2D] pb-2">
              02 / YOUR BUILDER DETAILS
            </h2>
            
            <div className="flex flex-col gap-[20px] mt-2">
              <BuilderTextField 
                label="FULL NAME"
                placeholder="e.g. Abhishek Jha"
                value={name}
                onChange={setName}
                maxLength={24}
              />
              <BuilderTextField 
                label="YOUR DESIGNATION"
                placeholder="e.g. Full Stack Builder"
                value={stack}
                onChange={setStack}
                maxLength={30}
              />
              <div onBlur={handleXHandleBlur}>
                <BuilderTextField 
                  label="YOUR X HANDLE"
                  placeholder="e.g. @shivv625"
                  value={xHandle}
                  onChange={handleXHandleChange}
                  maxLength={50} // Allow pasting full URLs, we trim on blur/submit
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: GENERATE CTA */}
        <div className="mt-10 flex flex-col gap-2">
          <div className="w-full text-center mb-1">
            <span className="font-serif text-sm italic text-[#003F2D]">READY TO BUILD?</span>
          </div>
          <GeneratePassButton 
            onClick={handleGenerate}
            disabled={!imageUrl || (mode === "id" && (!name || !xHandle))}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
