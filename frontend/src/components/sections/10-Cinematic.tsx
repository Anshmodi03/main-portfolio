"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const TOTAL_FRAMES = 80;

export default function CinematicZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr  = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let cleanup: (() => void) | undefined;

    const initScrollTrigger = () => {
      setLoaded(true);
      ctx.drawImage(images[0], 0, 0, W, H);

      const obj = { frame: 0 };

      const gsapCtx = gsap.context(() => {
        gsap.to(obj, {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.5,
            start: "top top",
            end: "+=200%",
            onUpdate: (self) => {
              const idx = Math.round(obj.frame);
              ctx.drawImage(images[idx], 0, 0, W, H);
              if (labelRef.current) {
                const a = Math.max(0, (self.progress - 0.65) / 0.35);
                labelRef.current.style.opacity = a.toFixed(3);
              }
            },
          },
        });
      }, sectionRef);

      cleanup = () => {
        gsapCtx.revert();
        window.removeEventListener("resize", resize);
      };
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) initScrollTrigger();
      };
      images.push(img);
    }

    return () => {
      if (cleanup) cleanup();
      else window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-base)] flex items-center justify-center min-h-[100dvh] overflow-hidden"
    >
      {!loaded && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Loading...
        </p>
      )}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <span
        ref={labelRef}
        className="absolute bottom-[var(--gutter)] left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] z-10 pointer-events-none opacity-0"
      >
        // Full Stack Developer
      </span>
    </section>
  );
}
