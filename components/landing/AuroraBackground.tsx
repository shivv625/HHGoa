"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function AuroraBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from center (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  // Parallax shifts
  const shiftX1 = prefersReducedMotion ? 0 : mousePos.x * -20;
  const shiftY1 = prefersReducedMotion ? 0 : mousePos.y * -20;
  
  const shiftX2 = prefersReducedMotion ? 0 : mousePos.x * 30;
  const shiftY2 = prefersReducedMotion ? 0 : mousePos.y * 30;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--hhg-navy)]">
      {/* Blob 1 */}
      <motion.div
        animate={{
          x: shiftX1,
          y: shiftY1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen opacity-50 blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--hhg-sunrise-1) 0%, transparent 70%)",
          animation: prefersReducedMotion ? "none" : "drift1 20s ease-in-out infinite alternate",
        }}
      />
      
      {/* Blob 2 */}
      <motion.div
        animate={{
          x: shiftX2,
          y: shiftY2,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-40 blur-[140px]"
        style={{
          background: "radial-gradient(circle, var(--hhg-sunrise-2) 0%, transparent 70%)",
          animation: prefersReducedMotion ? "none" : "drift2 25s ease-in-out infinite alternate",
        }}
      />

      {/* Blob 3 */}
      <motion.div
        animate={{
          x: shiftX1 * 1.5,
          y: shiftY1 * 1.5,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-screen opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, var(--hhg-accent) 0%, transparent 70%)",
          animation: prefersReducedMotion ? "none" : "drift3 30s ease-in-out infinite alternate",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--hhg-navy)_120%)] opacity-80" />

      {/* SVG Grain overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
