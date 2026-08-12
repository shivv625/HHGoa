"use client";

import React, { useState, useCallback } from "react";
import type { Area, Point } from "react-easy-crop";
import { BuilderPhotoUpload } from "./BuilderPhotoUpload";
import { BuilderTextField } from "./BuilderTextField";
import { GeneratePassButton } from "./GeneratePassButton";

interface BuilderFormProps {
  onNext: (data: { imageUrl: string; cropPixels: Area; name: string; stack: string }) => void;
}

export function BuilderForm({ onNext }: BuilderFormProps) {
  // State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCropPixels(croppedAreaPixels);
  }, []);

  const handleGenerate = () => {
    if (!imageUrl || !name || !cropPixels) return;
    onNext({ imageUrl, cropPixels, name, stack });
  };

  const clearPhoto = () => {
    setImageUrl(null);
    setCropPixels(null);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white rounded-[24px] shadow-[0_8px_25px_rgba(0,0,0,0.06)] border border-[#E5E5E0] p-[20px] md:p-[32px] flex flex-col gap-6 relative z-10">
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
      <BuilderTextField 
        label="Full Name"
        placeholder="e.g. Satoshi Nakamoto"
        value={name}
        onChange={setName}
        maxLength={24}
      />
      <BuilderTextField 
        label="Stack / Role"
        placeholder="e.g. Full-Stack / Rust / AI"
        value={stack}
        onChange={setStack}
        maxLength={30}
      />
      <GeneratePassButton 
        onClick={handleGenerate}
        disabled={!imageUrl || !name}
      />
    </div>
  );
}
