"use client";

import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { DRAW_SIZE } from "@/lib/canvas/renderHHGoaFrame";

interface FramePreviewProps {
  imageUrl: string;
  onCropChange: (croppedAreaPixels: Area) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function FramePreview({ imageUrl, onCropChange, zoom, setZoom }: FramePreviewProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropChange(croppedAreaPixels);
    },
    [onCropChange]
  );

  return (
    <div className="relative w-full aspect-square bg-black overflow-hidden shadow-2xl ring-1 ring-white/10">
      {/* The Cropper acts as the photo layer (80% of canvas roughly, placed slightly off center) */}
      <div 
        className="absolute"
        style={{
          top: `${(160 / DRAW_SIZE) * 100}%`,
          left: `${(60 / DRAW_SIZE) * 100}%`,
          width: `${(760 / DRAW_SIZE) * 100}%`,
          height: `${(760 / DRAW_SIZE) * 100}%`,
        }}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          objectFit="cover"
          showGrid={false}
          style={{
            containerStyle: { background: "transparent" },
            cropAreaStyle: { border: "none", boxShadow: "none" }
          }}
        />
      </div>

      {/* The Frame Overlay that sits ON TOP of the cropper */}
      {/* This mimics exactly the renderHHGoaFrame layer structure but purely via CSS/HTML for live interaction */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background masking the non-photo areas */}
        <div 
          className="absolute inset-0 bg-[#0B1A2B]"
          style={{
            clipPath: `polygon(
              0 0, 100% 0, 100% 100%, 0 100%, 0 0,
              ${(60 / DRAW_SIZE) * 100}% ${(160 / DRAW_SIZE) * 100}%,
              ${(60 / DRAW_SIZE) * 100}% ${((160 + 760) / DRAW_SIZE) * 100}%,
              ${((60 + 760) / DRAW_SIZE) * 100}% ${((160 + 760) / DRAW_SIZE) * 100}%,
              ${((60 + 760) / DRAW_SIZE) * 100}% ${(160 / DRAW_SIZE) * 100}%,
              ${(60 / DRAW_SIZE) * 100}% ${(160 / DRAW_SIZE) * 100}%
            )`
          }}
        />

        {/* Frame Graphic Layer */}
        <div 
          className="absolute border-r border-[rgba(244,232,216,0.1)]"
          style={{
            left: `${((60 + 760 + 40) / DRAW_SIZE) * 100}%`,
            top: 0,
            bottom: 0,
            width: 1
          }}
        />
        <div 
          className="absolute border-b border-[rgba(244,232,216,0.1)]"
          style={{
            top: `${((160 - 40) / DRAW_SIZE) * 100}%`,
            left: 0,
            right: 0,
            height: 1
          }}
        />

        {/* Accent Geometry */}
        <div className="absolute bg-[#FF7A45] w-[2%] h-[2%]" style={{ left: `${(60/DRAW_SIZE)*100}%`, top: `${(160/DRAW_SIZE)*100}%` }} />
        <div className="absolute bg-[#FF7A45] w-[2%] h-[2%]" style={{ left: `${((60+760-20)/DRAW_SIZE)*100}%`, top: `${((160+760-20)/DRAW_SIZE)*100}%` }} />

        {/* Typography */}
        <div className="absolute font-display font-bold text-[#F4E8D8] text-[5cqi] leading-none" style={{ left: `${(60/DRAW_SIZE)*100}%`, top: `${(40/DRAW_SIZE)*100}%` }}>
          HH GOA
        </div>
        <div className="absolute font-mono text-[#2FBF9F] text-[1.6cqi] text-right right-[3.7%]" style={{ top: `${(52/DRAW_SIZE)*100}%` }}>
          28—31 OCT 2026
        </div>
        <div className="absolute font-mono text-[#2FBF9F] text-[1.6cqi] text-right right-[3.7%]" style={{ top: `${(78/DRAW_SIZE)*100}%` }}>
          GOA · INDIA
        </div>

        <div className="absolute font-sans font-medium text-[rgba(244,232,216,0.7)] text-[2.2cqi]" style={{ left: `${(60/DRAW_SIZE)*100}%`, bottom: `${(40/DRAW_SIZE)*100}%` }}>
          LESS NOISE. MORE SIGNAL.
        </div>
        
        <div className="absolute font-mono text-[rgba(244,232,216,0.5)] text-[1.5cqi] right-[3.7%]" style={{ bottom: `${(40/DRAW_SIZE)*100}%` }}>
          2:47 PM STUDIO
        </div>

        {/* Vertical Text */}
        <div 
          className="absolute font-display font-bold text-[rgba(244,232,216,0.05)] text-[6.5cqi] origin-bottom-left -rotate-90"
          style={{ left: `${((DRAW_SIZE - 60)/DRAW_SIZE)*100}%`, top: `${((160 + 760)/DRAW_SIZE)*100}%` }}
        >
          BUILDER ID
        </div>
      </div>
    </div>
  );
}
