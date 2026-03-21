"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { marqueeRow1 } from "@/lib/data";

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const tween = gsap.to(el, { x: "-50%", duration: 15, ease: "none", repeat: -1 });
    return () => { tween.kill(); };
  }, []);

  return (
    <section
      className="overflow-hidden border-t border-b border-[var(--border)] py-4 bg-[var(--bg-base)]"
      aria-hidden="true"
    >
      <div className="flex w-max" ref={trackRef}>
        {[...marqueeRow1, ...marqueeRow1].map((item, i) => (
          <span
            key={i}
            className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--text-muted)] px-8 whitespace-nowrap"
          >
            {item}
            <span className="text-[var(--accent)] text-[8px] ml-8">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
