"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface CropStepProps {
  imageUrl: string;
  aspect: number;
  onCropComplete: (croppedAreaPixels: Area) => void;
}

export function CropStep({ imageUrl, aspect, onCropComplete }: CropStepProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="relative w-full aspect-square md:aspect-video max-h-[60vh] bg-black/50 rounded-xl overflow-hidden">
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
        objectFit="cover"
      />
    </div>
  );
}
