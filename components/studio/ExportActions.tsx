"use client";

import React, { useState } from "react";
import { Download, Share2 } from "lucide-react";

interface ExportActionsProps {
  onDownload: () => void;
  onShare: () => Promise<void>;
  isGenerating: boolean;
}

export function ExportActions({ onDownload, onShare, isGenerating }: ExportActionsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    await onShare();
    setIsSharing(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-8">
      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="w-full bg-[var(--hhg-sand)] text-[var(--hhg-navy)] hover:bg-white font-display font-bold py-4 px-6 rounded-none flex items-center justify-between transition-colors disabled:opacity-50 text-lg uppercase tracking-wider group"
      >
        <span>DOWNLOAD ID</span>
        <Download size={20} className="group-hover:translate-y-1 transition-transform" />
      </button>

      <button
        onClick={handleShare}
        disabled={isGenerating || isSharing}
        className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-mono text-sm py-4 px-6 rounded-none flex items-center justify-between transition-colors disabled:opacity-50 uppercase tracking-widest group"
      >
        <span>{isSharing ? "PREPARING..." : "SHARE TO X"}</span>
        <Share2 size={16} className={isSharing ? "animate-pulse" : "group-hover:-translate-y-1 transition-transform"} />
      </button>
    </div>
  );
}
