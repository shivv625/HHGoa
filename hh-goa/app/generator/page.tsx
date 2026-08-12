"use client";

import React, { useState, Suspense } from "react";
import type { Area } from "react-easy-crop";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderIntro } from "@/components/builder/BuilderIntro";
import { BuilderStepIndicator } from "@/components/builder/BuilderStepIndicator";
import { BuilderForm } from "@/components/builder/BuilderForm";
import { renderBuilderPass } from "@/lib/canvas/renderBuilderPass";
import { renderPFPFrame } from "@/lib/canvas/renderPFPFrame";
import { generateBuilderTitle } from "@/lib/canvas/generateBuilderTitle";

function BuilderCreatePage() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [currentFormStep, setCurrentFormStep] = useState<1 | 2 | 3>(1);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [generatedMode, setGeneratedMode] = useState<"pfp" | "id">("id");

  // Expose step progression based on state (mocked internally by checking if photo/details are filled)
  // Actually, we can let BuilderStepIndicator just display statically or driven by props, but let's 
  // simplify for now - we'll just pass currentFormStep down. We can assume if an image is uploaded, it's step 2.

  const handleNext = async (data: { imageUrl: string; cropPixels: Area; name: string; stack: string; mode: "pfp" | "id" }) => {
    setIsGenerating(true);
    setStep("result");
    setGeneratedMode(data.mode);
    
    try {
      let result;
      if (data.mode === "pfp") {
        result = await renderPFPFrame({
          imageSrc: data.imageUrl,
          crop: data.cropPixels,
        });
      } else {
        const builderClass = data.stack ? generateBuilderTitle(data.stack) : "BUILDER";
        result = await renderBuilderPass({
          imageSrc: data.imageUrl,
          crop: data.cropPixels,
          name: data.name,
          stack: data.stack,
          builderClass,
        });
      }
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
    <div className="flex flex-col min-h-screen w-full relative bg-[#F4F1E1] overflow-x-hidden selection:bg-[#F4D600] selection:text-[#003F2D]">
      
      {/* ========================================================
          ENVIRONMENTAL BACKGROUND GRAPHICS
      ======================================================== */}
      
      {/* Noise Grain */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
      />
      
      {/* Halftone Dot Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-[0] opacity-30 mix-blend-multiply"
        style={{ backgroundImage: "radial-gradient(#003F2D 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      {/* Editorial Marks */}
      <div className="absolute top-8 left-8 text-[#003F2D] font-mono text-xs opacity-50 z-[2]">+</div>
      <div className="absolute top-8 right-8 text-[#003F2D] font-mono text-xs opacity-50 z-[2]">+</div>
      <div className="absolute bottom-8 left-8 text-[#003F2D] font-mono text-xs opacity-50 z-[2]">+</div>
      <div className="absolute bottom-8 right-8 text-[#003F2D] font-mono text-xs opacity-50 z-[2]">+</div>

      {/* Large Sun */}
      <div className="absolute top-[-100px] right-[-100px] md:top-10 md:right-[15%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-[#EBA721] rounded-full mix-blend-multiply opacity-80 z-[1]" />
      
      {/* Sub-sun dither ring */}
      <div className="absolute top-[50px] right-[10%] w-[420px] h-[420px] rounded-full border border-[#EBA721] border-dashed opacity-50 z-[1] hidden md:block" />

      {/* Ocean Waves (CSS based) */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] opacity-[0.15] z-[2] pointer-events-none flex flex-col gap-6 overflow-hidden">
        <div className="w-[150%] h-[20px] border-b-[2px] border-[#003F2D] border-dashed rounded-[100%] ml-[-25%] mt-12" />
        <div className="w-[150%] h-[20px] border-b-[2px] border-[#003F2D] border-dashed rounded-[100%] ml-[-15%]" />
        <div className="w-[150%] h-[20px] border-b-[2px] border-[#003F2D] border-dashed rounded-[100%] ml-[-35%]" />
        <div className="w-[150%] h-[20px] border-b-[2px] border-[#003F2D] border-dashed rounded-[100%] ml-[-20%]" />
      </div>

      {/* Vector Palm Tree */}
      <svg className="absolute bottom-[-5%] left-[-10%] md:left-[-5%] w-[350px] h-[450px] md:w-[450px] md:h-[600px] opacity-90 z-[3] pointer-events-none mix-blend-multiply drop-shadow-md" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 300C60 250 80 180 110 120C115 110 118 100 120 90C125 150 160 170 190 180C160 140 140 120 125 90C160 95 190 85 210 70C170 65 145 60 125 80C130 40 160 15 190 0C150 15 130 35 120 70C110 30 110 -10 90 -30C100 10 100 40 110 75C70 40 40 20 0 10C40 35 70 60 100 85C60 75 20 80 -20 110C30 95 65 95 100 95C70 120 40 140 0 170C45 135 80 120 105 105C80 160 60 220 50 300Z" fill="#003F2D" />
      </svg>
      
      {/* Tiny birds */}
      <div className="absolute top-[20%] left-[20%] text-[#003F2D] opacity-60 z-[2] hidden md:block">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6C4 2 8 0 12 6C16 0 20 2 24 6" stroke="#003F2D" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div className="absolute top-[18%] left-[24%] text-[#003F2D] opacity-60 z-[2] hidden md:block scale-75">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6C4 2 8 0 12 6C16 0 20 2 24 6" stroke="#003F2D" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Floating Sticker */}
      <div className="absolute top-[25%] left-[8%] hidden lg:flex -rotate-3 z-[4] pointer-events-none items-center justify-center">
        <div className="bg-[#F4D600] px-4 py-2 border-2 border-[#E94B73] font-mono text-[#003F2D] text-xs font-bold shadow-[2px_2px_0_0_#003F2D] tracking-widest uppercase">
          BUILD FROM GOA
        </div>
      </div>

      {/* ========================================================
          PAGE CONTENT
      ======================================================== */}
      
      <div className="relative z-[10]">
        <BuilderHeader />
      </div>
      
      <main className="flex-1 w-full flex flex-col items-center pb-12 relative z-[10] max-w-[1200px] mx-auto px-4">
        {step === "form" ? (
          <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[680px]">
            <BuilderIntro />
            <BuilderStepIndicator currentStep={currentFormStep} />
            <BuilderForm onNext={handleNext} isGenerating={isGenerating} onStepChange={setCurrentFormStep} />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-xl animate-in zoom-in-95 fade-in duration-500 pt-6">
            <div className="bg-white px-6 py-2 rounded-none border border-[#003F2D] shadow-[2px_2px_0_0_#003F2D] text-[#003F2D] font-sans font-bold text-sm flex items-center gap-2 mb-8 animate-in slide-in-from-top-4 duration-500 delay-150 fill-mode-both uppercase tracking-widest">
              ✓ ID READY
            </div>

            <div className={`w-full max-w-[400px] md:max-w-[460px] ${generatedMode === "pfp" ? "aspect-square" : "aspect-[4/5]"} bg-white border-2 border-[#003F2D] shadow-[8px_8px_0_0_rgba(0,63,45,0.15)] relative overflow-hidden group`}>
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F4F1E1]">
                  <div className="animate-spin w-12 h-12 border-4 border-[#003F2D] border-t-[#F4D600] rounded-full mb-4" />
                  <span className="font-mono text-xs text-[#003F2D] tracking-widest">BUILDING YOUR ID...</span>
                </div>
              ) : (
                <img src={finalImage!} alt="Generated Builder Pass" className="w-full h-full object-contain bg-[#F4F1E1]" />
              )}
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4 mt-8 max-w-[460px]">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 h-[54px] bg-[#003F2D] hover:bg-[#002619] text-[#F4D600] font-sans font-bold text-[14px] uppercase tracking-wider border-2 border-[#003F2D] shadow-[4px_4px_0_0_#003F2D] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#003F2D] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>↓ Download Pass</span>
              </button>
              
              <button 
                onClick={handleShare}
                disabled={isGenerating || isSharing}
                className="flex-1 h-[54px] bg-black text-white hover:bg-gray-900 border-2 border-black font-sans font-bold text-[14px] uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSharing ? (
                  <span>PREPARING...</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    <span>SHARE</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => { setStep("form"); setCurrentFormStep(1); setFinalImage(null); }}
                disabled={isGenerating}
                className="flex-[0.5] h-[54px] bg-white border-2 border-[#003F2D] text-[#003F2D] font-sans font-bold text-[14px] uppercase shadow-[4px_4px_0_0_rgba(0,63,45,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(0,63,45,0.1)] transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                title="Create Another"
              >
                ↺
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Brand Footer */}
      <footer className="relative z-[10] w-full text-center py-6 font-mono text-[10px] sm:text-xs text-[#003F2D] tracking-widest uppercase opacity-80 flex flex-col gap-1">
        <span>BUILD · SHIP · REPEAT</span>
        <span>GOA, INDIA · 28—31 OCT 2026</span>
      </footer>

    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F1E1]" />}>
      <BuilderCreatePage />
    </Suspense>
  );
}
