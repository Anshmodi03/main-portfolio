"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const SYMBOLS = ["{ }", "[ ]", "=>", "async", "const", "</>", "::"];

export default function CinematicZoom() {
  const sectionRef    = useRef<HTMLElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);

  // Individual element refs for staged reveal
  const wrapRef       = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLParagraphElement>(null);
  const line1Ref      = useRef<HTMLSpanElement>(null);
  const line2Ref      = useRef<HTMLSpanElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const statItemsRef  = useRef<HTMLDivElement>(null);
  const hintRef       = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (!line1Ref.current || !line2Ref.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let currentProgress = 0;

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

      // Dark veil — smoothly dims canvas to near-black before reveal
      if (eased > 0.87) {
        const veilAlpha = Math.min(0.94, (eased - 0.87) / 0.13);
        ctx.fillStyle   = `rgba(8,8,8,${veilAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    // ─── Resize ───────────────────────────────────────────────────
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

    // ─── GSAP ─────────────────────────────────────────────────────
    let split1: InstanceType<typeof SplitText> | null = null;
    let split2: InstanceType<typeof SplitText> | null = null;

    const gsapCtx = gsap.context(() => {
      // Set initial visibility on wrapper
      gsap.set(wrapRef.current, { autoAlpha: 1 });

      // Split headline lines into individual chars
      split1 = new SplitText(line1Ref.current!, { type: "chars" });
      split2 = new SplitText(line2Ref.current!, { type: "chars" });

      // Paused reveal timeline — driven by scroll progress 0.88 → 1.0
      const revealTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      revealTl
        // Eyebrow
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0)
        // "FULL STACK" chars stagger up
        .fromTo(split1!.chars,
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.012 },
          0.12)
        // "DEVELOPER" chars stagger up
        .fromTo(split2!.chars,
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.012 },
          0.26)
        // Divider draws left → right
        .fromTo(dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.18, ease: "power2.inOut" },
          0.46)
        // Tagline fades up
        .fromTo(taglineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.18 },
          0.56)
        // Stat items stagger up
        .fromTo(
          statItemsRef.current ? Array.from(statItemsRef.current.children) : [],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.08 },
          0.66)
        // Scroll hint fades last
        .fromTo(hintRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.14 },
          0.86);

      // Pinned scroll + scrub drives revealTl
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
            // Map progress 0.88 → 1.00 to revealTl 0 → 1
            const revealP = Math.max(0, Math.min(1, (self.progress - 0.88) / 0.12));
            revealTl.progress(revealP);
          },
        },
      });
    }, sectionRef);

    return () => {
      gsapCtx.revert();
      split1?.revert();
      split2?.revert();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-base)] flex items-center justify-center min-h-[100dvh] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Staged reveal — driven by GSAP paused timeline via scroll progress */}
      <div
        ref={wrapRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none invisible"
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-8 opacity-0"
        >
          // ansh.modi
        </p>

        {/* Headline */}
        <h2 className="font-[var(--font-heading)] font-bold tracking-[-0.04em] leading-[0.92] text-center text-[clamp(52px,8vw,120px)] overflow-hidden">
          <span ref={line1Ref} className="block text-[var(--text-primary)]">FULL STACK</span>
          <span ref={line2Ref} className="block text-[var(--accent)]">DEVELOPER</span>
        </h2>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="w-16 h-px bg-[var(--accent)] mt-10 mb-6 opacity-0 origin-left"
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-mono text-[11px] tracking-[0.12em] text-[var(--text-muted)] mb-10 opacity-0"
        >
          React · Node.js · TypeScript · MongoDB
        </p>

        {/* Stats */}
        <div ref={statItemsRef} className="flex items-start gap-12">
          <div className="flex flex-col items-center gap-1 opacity-0">
            <span className="font-[var(--font-heading)] font-bold text-[clamp(28px,3.5vw,44px)] leading-none text-[var(--accent)] tracking-[-0.03em]">05+</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Years Exp</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-0">
            <span className="font-[var(--font-heading)] font-bold text-[clamp(28px,3.5vw,44px)] leading-none text-[var(--accent)] tracking-[-0.03em]">20+</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Projects</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-0">
            <span className="font-[var(--font-heading)] font-bold text-[clamp(28px,3.5vw,44px)] leading-none text-[var(--accent)] tracking-[-0.03em]">10+</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Clients</span>
          </div>
        </div>

        {/* Scroll hint */}
        <p
          ref={hintRef}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)] mt-12 opacity-0"
        >
          ↓ &nbsp;explore the work
        </p>
      </div>
    </section>
  );
}
