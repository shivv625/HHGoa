"use client";

import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { convertHeicToJpeg } from "@/lib/heic";

interface UploadStepProps {
  onImageSelected: (imageUrl: string) => void;
  maxImages?: number; // for Squad frame later
}

export function UploadStep({ onImageSelected, maxImages = 1 }: UploadStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setError(null);

      try {
        const blob = await convertHeicToJpeg(file);
        const url = URL.createObjectURL(blob);
        onImageSelected(url);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Try another one.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageSelected]
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--hhg-accent)]/50 rounded-xl bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-colors relative">
      <input
        type="file"
        accept="image/*,.heic"
        onChange={handleFileChange}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center gap-3 text-[var(--hhg-sand)]">
        <Upload size={32} className={isProcessing ? "animate-pulse" : ""} />
        <p className="font-mono text-sm text-center">
          {isProcessing ? "Processing image..." : "Tap or Drag to upload photo"}
        </p>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
}
