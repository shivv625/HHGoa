"use client";

import React, { useState, useRef } from "react";
import type { Area } from "react-easy-crop";
import { FramePreview } from "./FramePreview";
import { StudioControls } from "./StudioControls";
import { ExportActions } from "./ExportActions";
import { renderHHGoaFrame } from "@/lib/canvas/renderHHGoaFrame";
import { generateBuilderTitle } from "@/lib/canvas/generateBuilderTitle";

interface FrameStudioProps {
  imageUrl: string;
}

export function FrameStudio({ imageUrl }: FrameStudioProps) {
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);

  const builderClass = stack ? generateBuilderTitle(stack) : "";

  // The actual generator function used for both download and share
  const generateFinalImage = async () => {
    if (!cropPixels) return null;
    try {
      setIsGenerating(true);
      const dataUrl = await renderHHGoaFrame({
        imageSrc: imageUrl,
        crop: cropPixels,
        name,
        stack,
        builderClass
      });
      return dataUrl;
    } catch (err) {
      console.error("Failed to render frame:", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateFinalImage();
    if (!dataUrl) return;
    
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `hhgoa2026-builder-id-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    const dataUrl = await generateFinalImage();
    if (!dataUrl) return;

    let shareUrl = window.location.origin;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });
      
      if (res.ok) {
        const data = await res.json();
        shareUrl = `${window.location.origin}/share/${data.id}`;
      }
    } catch (err) {
      console.warn("Upload failed, falling back to home URL", err);
    }

    const text = encodeURIComponent('Building from Goa. 🌴\n\nHH Goa 2026.\n\n#FrameInGoa');
    const tweetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 px-4 py-8 animate-in fade-in duration-700">
      
      {/* Left Column - Large Preview */}
      <div className="flex-1 w-full flex flex-col gap-4">
        <div className="flex justify-between items-end mb-4">
          <span className="font-display font-bold text-2xl tracking-tight">STUDIO</span>
          <span className="font-mono text-xs text-[var(--hhg-sand)]/40 tracking-widest uppercase">Direct Manipulation</span>
        </div>
        
        <FramePreview 
          imageUrl={imageUrl}
          onCropChange={setCropPixels}
          zoom={zoom}
          setZoom={setZoom}
        />
        
        <p className="text-[var(--hhg-sand)]/40 text-[10px] font-mono tracking-widest uppercase text-center mt-4">
          Drag to position • Pinch or slide to scale
        </p>
      </div>

      {/* Right Column - Controls & Actions */}
      <div className="w-full lg:w-80 flex flex-col shrink-0 lg:pt-12">
        <StudioControls 
          zoom={zoom}
          setZoom={setZoom}
          name={name}
          setName={setName}
          stack={stack}
          setStack={setStack}
        />
        
        <div className="flex-1" />
        
        <ExportActions 
          onDownload={handleDownload}
          onShare={handleShare}
          isGenerating={isGenerating}
        />
      </div>

    </div>
  );
}
