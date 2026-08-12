"use client";

import React, { useState } from "react";
import { Download, Share2, RefreshCw } from "lucide-react";

interface ResultPanelProps {
  resultDataUrl: string | null;
  mode: "solo" | "card" | "squad";
  onCycleVariant: () => void;
}

export function ResultPanel({ resultDataUrl, mode, onCycleVariant }: ResultPanelProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = () => {
    if (!resultDataUrl) return;
    const a = document.createElement("a");
    a.href = resultDataUrl;
    a.download = `hhgoa2026-frame-${mode}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    // Share functionality will be implemented in Step 6
    alert("Share to X coming soon!");
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleDownload}
          disabled={!resultDataUrl}
          className="flex-1 bg-[var(--hhg-sunrise-1)] hover:bg-[var(--hhg-sunrise-2)] text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          <span>Download</span>
        </button>

        <button
          onClick={handleShare}
          disabled={!resultDataUrl || isSharing}
          className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 size={20} />
          <span>{isSharing ? "Preparing..." : "Share to X"}</span>
        </button>
      </div>

      <button
        onClick={onCycleVariant}
        className="text-[var(--hhg-sand)]/70 hover:text-[var(--hhg-sand)] flex items-center justify-center gap-2 py-2 transition-colors text-sm font-mono"
      >
        <RefreshCw size={16} />
        <span>Regenerate variant</span>
      </button>
    </div>
  );
}
