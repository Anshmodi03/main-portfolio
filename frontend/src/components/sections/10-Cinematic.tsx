"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SYMBOLS = ["{ }", "[ ]", "=>", "async", "const", "</>", "::"];

export default function CinematicZoom() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let currentProgress = 0;

    const draw = (progress: number) => {
      const eased = progress * progress * (3 - 2 * progress); // smooth-step
      const scale  = 0.55 + eased * 22; // zoom: tight grid → extreme close-up

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, W, H);

      const gridSize  = 90;
      const halfCols  = Math.ceil(W / 2 / gridSize) + 3;
      const halfRows  = Math.ceil(H / 2 / gridSize) + 3;
      const maxDim    = Math.max(W, H);
      const fontSize  = Math.max(8, Math.min(10 * scale, 300));

      ctx.font         = `${fontSize}px "Geist Mono", monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      for (let c = -halfCols; c <= halfCols; c++) {
        for (let r = -halfRows; r <= halfRows; r++) {
          const gx = c * gridSize;
          const gy = r * gridSize;
          const sx = W / 2 + gx * scale;
          const sy = H / 2 + gy * scale;

          if (sx < -200 || sx > W + 200 || sy < -200 || sy > H + 200) continue;

          const dist           = Math.sqrt(gx * gx + gy * gy);
          const normalizedDist = dist / (maxDim * 0.55);
          const alpha          = Math.max(0, (1 - normalizedDist) * (1 - Math.min(1, eased * 1.15)));
          if (alpha < 0.008) continue;

          const brightness = Math.max(0, 1 - normalizedDist * 1.4);
          const g          = Math.round(70 + brightness * 25);
          ctx.fillStyle    = `rgba(251, ${g}, 13, ${alpha})`;

          const sym = SYMBOLS[Math.abs(c * 7 + r * 13) % SYMBOLS.length];
          ctx.fillText(sym, sx, sy);
        }
      }

      // Orange radial glow burst at high progress
      if (eased > 0.72) {
        const glowP  = (eased - 0.72) / 0.28;
        const radius = maxDim * 0.4 * glowP;
        const grd    = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, radius);
        grd.addColorStop(0, `rgba(251,70,13,${(0.28 * glowP).toFixed(3)})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }
    };

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
      draw(currentProgress);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);

    const gsapCtx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=200%",
          onUpdate: (self) => {
            currentProgress = self.progress;
            draw(self.progress);
            if (contentRef.current) {
              const t = Math.max(0, Math.min(1, (self.progress - 0.90) / 0.10));
              const a = 1 - Math.pow(1 - t, 2); // quadratic ease-out
              contentRef.current.style.opacity   = a.toFixed(3);
              contentRef.current.style.transform = `translateY(${((1 - a) * 24).toFixed(1)}px)`;
            }
          },
        },
      });
    }, sectionRef);

    return () => {
      gsapCtx.revert();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-base)] flex items-center justify-center min-h-[100dvh] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* End-state reveal — burns through the orange glow at 80–100% progress */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none opacity-0"
      >
        {/* Eyebrow */}
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-8">
          // Full Stack Developer
        </p>

        {/* Headline */}
        <h2 className="font-[var(--font-heading)] font-bold tracking-[-0.04em] leading-[0.92] text-center text-[clamp(52px,8vw,120px)]">
          <span className="block text-[var(--text-primary)]">FULL STACK</span>
          <span className="block text-[var(--accent)]">DEVELOPER</span>
        </h2>

        {/* Divider */}
        <div className="w-16 h-px bg-[var(--accent)] mt-10 mb-10" />

        {/* Stats row */}
        <div className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span>5+ Years</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>20+ Projects</span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>10+ Clients</span>
        </div>

        {/* Scroll prompt */}
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)] mt-12">
          ↓ &nbsp;Continue
        </p>
      </div>
    </section>
  );
}
