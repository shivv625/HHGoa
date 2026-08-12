"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { User, Users, IdCard } from "lucide-react";

interface ModeCardProps {
  href: string;
  title: string;
  description: string;
  icon: "user" | "users" | "idcard";
  featured?: boolean;
}

export function ModeCard({ href, title, description, icon, featured = false }: ModeCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => !prefersReducedMotion && setIsHovering(true);
  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    setIsHovering(false);
    // Reset to center
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: rect.width / 2, y: rect.height / 2 });
    }
  };

  // Compute tilt based on mouse position relative to center
  let rotateX = 0;
  let rotateY = 0;
  if (isHovering && cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // ±6 degrees max tilt
    rotateX = ((mousePos.y - centerY) / centerY) * -6;
    rotateY = ((mousePos.x - centerX) / centerX) * 6;
  }

  const IconComponent = icon === "user" ? User : icon === "users" ? Users : IdCard;
  
  // Icon colors and animation delay (different phase per card)
  const iconColors = {
    user: "text-[var(--hhg-accent)]",
    users: "text-[var(--hhg-sunrise-2)]",
    idcard: "text-[var(--hhg-sunrise-1)]"
  };
  
  const iconBgs = {
    user: "bg-[var(--hhg-accent)]/10",
    users: "bg-[var(--hhg-sunrise-2)]/10",
    idcard: "bg-[var(--hhg-sunrise-1)]/10"
  };

  const phaseDelay = icon === "users" ? 0 : icon === "idcard" ? 1 : 2;

  return (
    <Link 
      href={href} 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative block w-full rounded-2xl ${featured ? "col-span-1 md:col-span-2 p-6 md:p-8" : "p-5"} 
        bg-black/30 backdrop-blur-xl border border-transparent overflow-hidden transition-all duration-300
        hover:border-[var(--hhg-sand)]/30 hover:bg-black/40`}
      style={{
        perspective: prefersReducedMotion ? "none" : "800px",
        transformStyle: "preserve-3d",
        transform: prefersReducedMotion ? "none" : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        // CSS pseudo border using gradient for top-left light source
        borderImage: "linear-gradient(135deg, rgba(244, 232, 216, 0.4) 0%, rgba(244, 232, 216, 0.05) 100%) 1"
      }}
    >
      {/* Radial glow spotlight */}
      {!prefersReducedMotion && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`
          }}
        />
      )}

      <div className={`relative z-10 flex ${featured ? "flex-col md:flex-row items-start md:items-center gap-6" : "items-center gap-4"}`} style={{ transform: "translateZ(30px)" }}>
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: phaseDelay }}
          className={`p-4 rounded-xl ${iconBgs[icon]} ${iconColors[icon]} ring-1 ring-inset ring-white/10`}
        >
          <IconComponent size={featured ? 32 : 24} strokeWidth={1.5} />
        </motion.div>
        <div className="text-left flex-1">
          <h3 className={`font-bold font-display tracking-wide ${featured ? "text-2xl" : "text-lg"}`}>{title}</h3>
          <p className={`text-[var(--hhg-sand)]/60 ${featured ? "text-base mt-2" : "text-sm"}`}>{description}</p>
        </div>
      </div>
    </Link>
  );
}
