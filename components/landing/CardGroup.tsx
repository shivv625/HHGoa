"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ModeCard } from "./ModeCard";

export function CardGroup() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" as const }
    },
  };

  const cards = [
    {
      href: "/generator?mode=squad",
      title: "Squad Frame",
      description: "2-3 photos combined",
      icon: "users" as const,
      featured: true,
    },
    {
      href: "/generator?mode=solo",
      title: "PFP Frame",
      description: "Single photo profile picture",
      icon: "user" as const,
    },
    {
      href: "/generator?mode=card",
      title: "🌴 Builder ID",
      description: "Photo + Stack + Auto Title",
      icon: "idcard" as const,
    }
  ];

  if (prefersReducedMotion) {
    return (
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 px-4 z-10 relative">
        {cards.map((card, i) => (
          <div key={i} className={card.featured ? "col-span-1 md:col-span-2" : ""}>
            <ModeCard {...card} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 px-4 z-10 relative"
    >
      {cards.map((card, i) => (
        <motion.div key={i} variants={item} className={card.featured ? "col-span-1 md:col-span-2" : ""}>
          <ModeCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
}
