"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UploadStep } from "@/components/UploadStep";
import { CropStep } from "@/components/CropStep";
import { FrameCanvas } from "@/components/FrameCanvas";
import { ResultPanel } from "@/components/ResultPanel";
import type { Area } from "react-easy-crop";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function GeneratorContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "solo") as "solo" | "card" | "squad";

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [crops, setCrops] = useState<Area[]>([]);
  const [tempCrop, setTempCrop] = useState<Area | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);

  const step = imageUrls.length === 0 ? "upload" : crops.length === 0 ? "crop" : "result";

  const handleImageSelected = (url: string) => {
    setImageUrls([url]);
  };

  const handleCropChange = (croppedAreaPixels: Area) => {
    setTempCrop(croppedAreaPixels);
  };

  const confirmCrop = () => {
    if (tempCrop) {
      setCrops([tempCrop]);
    }
  };

  const handleCycleVariant = () => {
    setVariantIndex((prev) => (prev + 1) % 3);
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hhg-navy)] to-black -z-10" />
      
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--hhg-sand)]/70 hover:text-[var(--hhg-sand)] transition-colors w-fit">
          <ArrowLeft size={16} />
          <span className="font-mono text-sm">Back</span>
        </Link>

        {step === "upload" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Choose your photo</h2>
            <UploadStep onImageSelected={handleImageSelected} />
          </div>
        )}

        {step === "crop" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Position your photo</h2>
            <CropStep 
              imageUrl={imageUrls[0]} 
              aspect={mode === "card" ? 1080 / 1350 : 1} 
              onCropComplete={handleCropChange} 
            />
            <p className="text-[var(--hhg-sand)]/60 text-sm mt-4 text-center">
              Pinch or scroll to zoom. Drag to move.
            </p>
            <button
              onClick={confirmCrop}
              disabled={!tempCrop}
              className="w-full mt-6 bg-[var(--hhg-accent)] text-black font-bold py-3 rounded-lg hover:bg-[#25997f] transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 self-start">Your #FrameInGoa</h2>
            <FrameCanvas
              mode={mode}
              imageUrls={imageUrls}
              crops={crops}
              variantIndex={variantIndex}
              onResultReady={setResultDataUrl}
            />
            <ResultPanel
              resultDataUrl={resultDataUrl}
              mode={mode}
              onCycleVariant={handleCycleVariant}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}

