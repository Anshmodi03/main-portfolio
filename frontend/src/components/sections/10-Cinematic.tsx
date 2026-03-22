"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CinematicZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current || !labelRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: "+=150%",
        },
      });

      // Text zooms from far away toward the viewer
      tl.fromTo(
        textRef.current,
        { scale: 0.35, opacity: 0 },
        { scale: 1.5,  opacity: 1, ease: "none" }
      );

      // Mono label fades in at 20% scroll progress
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0,  ease: "none" },
        0.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-base)] flex items-center justify-center min-h-[100dvh] overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(251,70,13,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Zoom text block */}
      <div ref={textRef} className="relative z-10 text-center select-none will-change-transform">
        <p className="font-[var(--font-heading)] font-bold leading-[0.9] tracking-[-0.04em] text-[clamp(64px,10vw,160px)] text-[var(--text-primary)]">
          CRAFTING
        </p>
        <p className="font-[var(--font-heading)] font-bold leading-[0.9] tracking-[-0.04em] text-[clamp(64px,10vw,160px)] text-[var(--accent)]">
          DIGITAL
        </p>
        <p className="font-[var(--font-heading)] font-bold leading-[0.9] tracking-[-0.04em] text-[clamp(64px,10vw,160px)] text-[var(--text-primary)]">
          EXPERIENCES.
        </p>
      </div>

      {/* Mono label */}
      <span
        ref={labelRef}
        className="absolute bottom-[var(--gutter)] left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] z-10"
      >
        // Full Stack Developer
      </span>
    </section>
  );
}
