"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { Area, Point } from "react-easy-crop";
import { BuilderPhotoUpload } from "./BuilderPhotoUpload";
import { BuilderTextField } from "./BuilderTextField";
import { GeneratePassButton } from "./GeneratePassButton";

interface BuilderFormProps {
  onNext: (data: { imageUrl: string; cropPixels: Area; name: string; stack: string }) => void;
  isGenerating?: boolean;
  onStepChange?: (step: 1 | 2 | 3) => void;
}

export function BuilderForm({ onNext, isGenerating, onStepChange }: BuilderFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  // Auto step tracking
  useEffect(() => {
    if (onStepChange) {
      if (imageUrl && (name || stack)) {
        onStepChange(3);
      } else if (imageUrl) {
        onStepChange(2);
      } else {
        onStepChange(1);
      }
    }
  }, [imageUrl, name, stack, onStepChange]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const handleGenerate = () => {
    if (!imageUrl || !name || !cropPixels || isGenerating) return;
    onNext({ imageUrl, cropPixels, name, stack });
  };

  const clearPhoto = () => {
    setImageUrl(null);
    setCropPixels(null);
  };

  return (
    <div className="w-full max-w-[680px] mx-auto bg-[#FFFDF5] border-2 border-[#003F2D] shadow-[8px_8px_0_0_#003F2D] flex flex-col relative z-10 p-0 overflow-hidden">
      
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b-2 border-[#003F2D] bg-[#F4D600] px-4 py-3">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold tracking-widest text-[#003F2D]">BUILDER STUDIO</span>
          <span className="font-sans text-[11px] font-medium text-[#003F2D] opacity-80">Create your builder identity.</span>
        </div>
        <div className="font-mono text-[10px] bg-white border border-[#003F2D] px-2 py-1 text-[#003F2D] font-bold">
          GOA · 2026
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
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="font-mono font-bold text-[12px] text-[#003F2D] tracking-widest uppercase border-b-2 border-dashed border-[#003F2D] pb-2">
            02 / YOUR BUILDER DETAILS
          </h2>
          
          <div className="flex flex-col gap-[20px] mt-2">
            <BuilderTextField 
              label="FULL NAME"
              placeholder="e.g. Shiv Sankar"
              value={name}
              onChange={setName}
              maxLength={24}
            />
            <BuilderTextField 
              label="STACK / BUILDER ROLE"
              placeholder="e.g. Full-Stack · AI · Rust"
              value={stack}
              onChange={setStack}
              maxLength={30}
            />
          </div>
        </div>

        {/* SECTION: GENERATE CTA */}
        <div className="mt-10 flex flex-col gap-2">
          <div className="w-full text-center mb-1">
            <span className="font-serif text-sm italic text-[#003F2D]">READY TO BUILD?</span>
          </div>
          <GeneratePassButton 
            onClick={handleGenerate}
            disabled={!imageUrl || !name}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
