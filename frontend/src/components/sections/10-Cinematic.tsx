"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SYMBOLS = ["{ }", "[ ]", "=>", "async", "const", "</>", "::"];

interface Props {
  onComplete: () => void;
}

export default function CinematicTransition({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    // ─── Canvas draw ──────────────────────────────────────────────
    const draw = (progress: number) => {
      const eased = progress * progress * (3 - 2 * progress); // smooth-step
      const scale = 0.55 + eased * 22;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, W, H);

      const gridSize = 90;
      const halfCols = Math.ceil(W / 2 / gridSize) + 3;
      const halfRows = Math.ceil(H / 2 / gridSize) + 3;
      const maxDim   = Math.max(W, H);
      const fontSize = Math.max(8, Math.min(10 * scale, 300));

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
          ctx.fillText(SYMBOLS[Math.abs(c * 7 + r * 13) % SYMBOLS.length], sx, sy);
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

      // Dark veil — smoothly dims canvas to near-black before fade-out
      if (eased > 0.87) {
        const veilAlpha = Math.min(0.94, (eased - 0.87) / 0.13);
        ctx.fillStyle   = `rgba(8,8,8,${veilAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    // ─── Resize ───────────────────────────────────────────────────
    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);

    // ─── Time-based GSAP drive ────────────────────────────────────
    const obj = { progress: 0 };

    // Start canvas invisible — preloader curtain was solid dark, ease in smoothly
    gsap.set(canvas, { opacity: 0 });

    const tl = gsap.timeline();

    // Phase 0: fade canvas IN (preloader was dark, canvas eases in — no pop)
    tl.to(canvas, {
      opacity: 1,
      duration: 0.45,
      ease: "power2.out",
    }, 0)
    // Phase 1: zoom animation — starts at t=0.2, overlaps with fade-in
    .to(obj, {
      progress: 1,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => draw(obj.progress),
    }, 0.2)
    // Phase 2: fade canvas OUT — veil is near-black at this point, seamless into hero bg
    .to(canvas, {
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    }, 1.7);

    return () => {
      tl.kill();
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
