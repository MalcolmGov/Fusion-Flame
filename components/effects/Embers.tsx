"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface EmbersProps {
  count?: number;
  className?: string;
}

/** Softly rising fire embers. Pure CSS animation — cheap to render. */
export function Embers({ count = 18, className }: EmbersProps) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // deterministic pseudo-random, rounded to 2dp so SSR and client
        // markup agree bit-for-bit (Math.sin precision differs per engine)
        const seed = (i * 9301 + 49297) % 233280;
        const rand = (n: number) => {
          const x = Math.sin(seed + n * 12.9898) * 43758.5453;
          return Math.round((x - Math.floor(x)) * 100) / 100;
        };
        return {
          id: i,
          left: rand(1) * 100,
          size: Math.round((2 + rand(2) * 4) * 10) / 10,
          delay: rand(3) * 6,
          duration: 5 + rand(4) * 6,
          drift: Math.round((rand(5) - 0.5) * 90),
          hue: rand(6) > 0.5 ? "#ff8a00" : "#d4af37",
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-0 rounded-full animate-ember"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: e.hue,
            boxShadow: `0 0 ${Math.round(e.size * 3)}px ${e.size}px ${e.hue}44`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            ["--ember-drift" as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
