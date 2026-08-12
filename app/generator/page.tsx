"use client";

import React, { useState, Suspense } from "react";
import type { Area } from "react-easy-crop";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderIntro } from "@/components/builder/BuilderIntro";
import { BuilderActionPills } from "@/components/builder/BuilderActionPills";
import { BuilderForm } from "@/components/builder/BuilderForm";
import { renderBuilderPass } from "@/lib/canvas/renderBuilderPass";
import { generateBuilderTitle } from "@/lib/canvas/generateBuilderTitle";

function BuilderCreatePage() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleNext = async (data: { imageUrl: string; cropPixels: Area; name: string; stack: string }) => {
    setIsGenerating(true);
    setStep("result");
    
    try {
      const builderClass = data.stack ? generateBuilderTitle(data.stack) : "BUILDER";
      const result = await renderBuilderPass({
        imageSrc: data.imageUrl,
        crop: data.cropPixels,
        name: data.name,
        stack: data.stack,
        builderClass,
      });
      setFinalImage(result);
    } catch (err) {
      console.error(err);
      alert("Failed to render card.");
      setStep("form");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!finalImage) return;
    const a = document.createElement("a");
    a.href = finalImage;
    a.download = `hhgoa2026-pass-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!finalImage) return;
    setIsSharing(true);
    let shareUrl = window.location.origin;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: finalImage }),
      });
      
      if (res.ok) {
        const data = await res.json();
        shareUrl = `${window.location.origin}/share/${data.id}`;
      }
    } catch (err) {
      console.warn("Upload failed", err);
    }

    const text = encodeURIComponent('Building from Goa. 🌴\n\nHH Goa 2026.\n\n#FrameInGoa');
    const tweetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank");
    setIsSharing(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative bg-[#FFF9EC]">
      {/* Subtle paper dot pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(0,63,45,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <BuilderHeader />
      
      <main className="flex-1 w-full flex flex-col items-center pb-20 relative z-10 w-full max-w-[1200px] mx-auto">
        {step === "form" ? (
          <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BuilderIntro />
            <BuilderActionPills />
            <BuilderForm onNext={handleNext} />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-xl animate-in zoom-in duration-500 pt-12 px-4">
            <div className="bg-white px-6 py-2 rounded-full border border-[#E5E5E0] shadow-sm text-[#003F2D] font-sans font-bold text-sm flex items-center gap-2 mb-8">
              ✓ Your Builder Pass Is Ready
            </div>

            <div className="w-full max-w-[400px] md:max-w-[500px] aspect-[3/4] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-[#E5E5E0] relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#FFF9EC]">
                  <div className="animate-spin w-12 h-12 border-4 border-[#003F2D] border-t-[#F4D600] rounded-full" />
                </div>
              ) : (
                <img src={finalImage!} alt="Generated Builder Pass" className="w-full h-full object-contain bg-[#FFF9EC]" />
              )}
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4 mt-8 max-w-[500px]">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 h-[52px] bg-[#00432F] hover:bg-[#002619] text-[#F5D900] font-sans font-bold rounded-[14px] shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>↓ Download Pass</span>
              </button>
              
              <button 
                onClick={handleShare}
                disabled={isGenerating || isSharing}
                className="flex-1 h-[52px] bg-white hover:bg-gray-50 border border-[#D7D8CE] text-[#003F2D] font-sans font-bold rounded-[14px] shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSharing ? "Preparing..." : "✕ Share to X"}</span>
              </button>

              <button 
                onClick={() => setStep("form")}
                disabled={isGenerating}
                className="flex-1 h-[52px] bg-white hover:bg-gray-50 border border-[#D7D8CE] text-[#003F2D] font-sans font-bold rounded-[14px] shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>↺ Create Another</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9EC]" />}>
      <BuilderCreatePage />
    </Suspense>
  );
}
