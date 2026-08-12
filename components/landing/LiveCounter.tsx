"use client";

import { useEffect, useState } from "react";

export function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fake a starting count to look live
    let current = 234;
    setCount(current);

    const interval = setInterval(() => {
      // Randomly increment by 1 sometimes
      if (Math.random() > 0.7) {
        current += 1;
        setCount(current);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-black/50 backdrop-blur-md border border-white/10 rounded-full py-2 px-4 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[var(--hhg-accent)] animate-[live-pulse_2s_infinite]" />
      <span className="font-mono text-sm text-[var(--hhg-sand)]/80">
        <strong className="text-white">{count.toLocaleString()}</strong> builders framed
      </span>
    </div>
  );
}
