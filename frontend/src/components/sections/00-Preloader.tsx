"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const brandRef     = useRef<HTMLSpanElement>(null);
  const topRef       = useRef<HTMLDivElement>(null);
  const botRef       = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      const tl  = gsap.timeline();

      // Phase 1 (0–2s): bar fills + counter counts
      tl.to(barRef.current, { scaleX: 1, duration: 2, ease: "power2.inOut", transformOrigin: "left" }, 0)
        .to(obj, {
          val: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(obj.val));
          },
        }, 0)
        .fromTo(counterRef.current, { scale: 1.1 }, { scale: 1, duration: 2, ease: "power2.inOut" }, 0);

      // Phase 2 (1.6s): brand fades in
      tl.fromTo(brandRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.6);

      // Accent line draws across at 2.0s — just before panels split
      tl.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          boxShadow: "0 0 12px rgba(251,70,13,0.8), 0 0 24px rgba(251,70,13,0.4)",
          duration: 0.4, ease: "power3.inOut",
        },
        2.0
      );
      tl.to(lineRef.current, { opacity: 0, duration: 0.2 }, 2.4);

      // Phase 3 (2.4s): dramatic split exit
      tl.to(topRef.current, { y: "-100%", duration: 0.9, ease: "power4.inOut" }, 2.4)
        .to(botRef.current, { y: "100%", duration: 0.9, ease: "power4.inOut" }, 2.4)
        .call(() => { setVisible(false); onComplete(); }, [], 3.1);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[var(--bg-base)] flex items-center justify-center"
    >
      {/* Split exit panels */}
      <div ref={topRef} className="preloader__half preloader__half--top" />
      <div ref={botRef} className="preloader__half preloader__half--bot" />

      {/* Horizontal accent slash — draws just before panel split */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--accent)] z-[4] scale-x-0 origin-left"
      />

      {/* Giant counter */}
      <span
        ref={counterRef}
        className="relative z-[3] select-none leading-none font-bold tracking-[-0.05em] text-[var(--text-primary)] text-[clamp(80px,14vw,160px)] font-[var(--font-heading)]"
      >
        0
      </span>

      {/* Brand label */}
      <span
        ref={brandRef}
        className="absolute bottom-[var(--gutter)] left-[var(--gutter)] z-[3] font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]"
      >
        Ansh Modi — Portfolio
      </span>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--border)] z-[3]">
        <div
          ref={barRef}
          className="h-full bg-[var(--accent)] origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
