"use client";

import React, { useEffect, useState, useRef } from "react";
import type { Area } from "react-easy-crop";
import { drawFrameSolo } from "@/lib/canvas/drawFrameSolo";

interface FrameCanvasProps {
  mode: "solo" | "card" | "squad";
  imageUrls: string[];
  crops: Area[];
  variantIndex: number;
  onResultReady: (dataUrl: string) => void;
}

export function FrameCanvas({
  mode,
  imageUrls,
  crops,
  variantIndex,
  onResultReady,
}: FrameCanvasProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === "solo" && imageUrls[0] && crops[0]) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      
      debounceRef.current = setTimeout(async () => {
        try {
          const result = await drawFrameSolo(imageUrls[0], crops[0], variantIndex);
          setPreviewUrl(result);
          onResultReady(result);
        } catch (error) {
          console.error("Failed to draw frame:", error);
        }
      }, 50); // 50ms debounce
    }
    // We'll add card and squad modes later

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [mode, imageUrls, crops, variantIndex, onResultReady]);

  if (!previewUrl) {
    return (
      <div className="w-full aspect-square bg-black/20 animate-pulse rounded-xl flex items-center justify-center border border-[var(--hhg-accent)]/30">
        <span className="text-[var(--hhg-sand)]/50 font-mono text-sm">Generating preview...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* We use an img tag for the preview since it handles responsive scaling natively */}
      <img
        src={previewUrl}
        alt="Frame Preview"
        className="w-full h-auto object-contain"
      />
    </div>
  );
}
