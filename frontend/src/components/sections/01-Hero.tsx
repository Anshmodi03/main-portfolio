"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Button } from "@/components/ui/button";

const LINES = ["BUILDING", "THE FUTURE,", "ONE LINE", "AT A TIME."];

const STAT_ITEMS = [
  { value: "40+", label: "Projects" },
  { value: "1+",  label: "Yr Exp"  },
  { value: "∞",   label: "Learning" },
];

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const sectionRef    = useRef<HTMLElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const eyebrowRef    = useRef<HTMLSpanElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const topBarRef     = useRef<HTMLDivElement>(null);
  const ruleRef       = useRef<HTMLDivElement>(null);
  const ghostRef      = useRef<HTMLDivElement>(null);
  const orb1Ref       = useRef<HTMLDivElement>(null);
  const orb2Ref       = useRef<HTMLDivElement>(null);
  const orb3Ref       = useRef<HTMLDivElement>(null);
  const bracketTLRef  = useRef<SVGSVGElement>(null);
  const bracketBRRef  = useRef<SVGSVGElement>(null);
  const codeLabelRef  = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const gridRef       = useRef<HTMLDivElement>(null);
  const gradLineRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin, DrawSVGPlugin);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      /* ── Ambient orb float loops ── */
      gsap.to(orb1Ref.current, {
        y: -50, x: 25, duration: 9,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      gsap.to(orb2Ref.current, {
        y: 40, x: -35, duration: 12,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5,
      });
      gsap.to(orb3Ref.current, {
        x: 30, y: -20, duration: 7,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1,
      });

      /* ── Ghost "AM" breathe ── */
      gsap.to(ghostRef.current, {
        scale: 1.04, duration: 8,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      /* ── Code label float ── */
      gsap.to(codeLabelRef.current, {
        y: -6, duration: 5,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      /* ── Mouse parallax via quickTo ── */
      const xQ = [
        gsap.quickTo(orb1Ref.current,  "x", { duration: 1.2, ease: "power3.out" }),
        gsap.quickTo(orb2Ref.current,  "x", { duration: 1.6, ease: "power3.out" }),
        gsap.quickTo(orb3Ref.current,  "x", { duration: 0.9, ease: "power3.out" }),
        gsap.quickTo(ghostRef.current, "x", { duration: 2.0, ease: "power3.out" }),
      ];
      const yQ = [
        gsap.quickTo(orb1Ref.current,  "y", { duration: 1.2, ease: "power3.out" }),
        gsap.quickTo(orb2Ref.current,  "y", { duration: 1.6, ease: "power3.out" }),
        gsap.quickTo(orb3Ref.current,  "y", { duration: 0.9, ease: "power3.out" }),
        gsap.quickTo(ghostRef.current, "y", { duration: 2.0, ease: "power3.out" }),
      ];
      const DEPTHS = [0.04, 0.03, 0.06, 0.015];

      const onMouseMove = (e: MouseEvent) => {
        const cx = e.clientX - window.innerWidth  / 2;
        const cy = e.clientY - window.innerHeight / 2;
        DEPTHS.forEach((d, i) => { xQ[i](cx * d); yQ[i](cy * d); });

        /* Heading tilt */
        if (headingRef.current) {
          const rx = ((e.clientY / window.innerHeight) - 0.5) *  2.5;
          const ry = ((e.clientX / window.innerWidth)  - 0.5) * -2.5;
          gsap.to(headingRef.current, { rotateX: rx, rotateY: ry, duration: 0.9, ease: "power3.out", transformPerspective: 800 });
        }
      };

      const onMouseLeave = () => {
        DEPTHS.forEach((_, i) => { xQ[i](0); yQ[i](0); });
        gsap.to(headingRef.current, { rotateX: 0, rotateY: 0, duration: 1.2, ease: "power3.out" });
      };

      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);

      /* ── Multi-layer scroll parallax ── */
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=90%",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          if (ghostRef.current)    gsap.set(ghostRef.current,    { y: -p * 15 });
          if (orb1Ref.current)     gsap.set(orb1Ref.current,     { y: -p * 30 });
          if (orb2Ref.current)     gsap.set(orb2Ref.current,     { y: -p * 20 });
          if (orb3Ref.current)     gsap.set(orb3Ref.current,     { y: -p * 40 });
          if (bracketTLRef.current) gsap.set(bracketTLRef.current,{ y: -p * 10 });
          if (bracketBRRef.current) gsap.set(bracketBRRef.current,{ y: -p * 10 });
          if (contentRef.current)  gsap.set(contentRef.current,  { y: -p * 80, opacity: 1 - p * 1.3 });
        },
      });

      /* ── Entrance timeline ── */
      const tl = gsap.timeline();

      // Grid fade in (very slow, atmospheric)
      tl.fromTo(gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: "power1.out" },
        0
      );

      // Ghost "AM" materialise
      tl.fromTo(ghostRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 0.035, scale: 1, duration: 2.4, ease: "power1.out" },
        0
      );

      // Top meta bar
      tl.fromTo(topBarRef.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.1
      );

      // Horizontal rule + gradient line
      tl.fromTo(ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power3.inOut" },
        0.2
      );
      tl.fromTo(gradLineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0.9
      );

      // Corner brackets DrawSVG
      if (bracketTLRef.current && bracketBRRef.current) {
        tl.fromTo(
          [bracketTLRef.current.querySelectorAll("path"), bracketBRRef.current.querySelectorAll("path")],
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.2, ease: "power2.inOut", stagger: 0.1 },
          0.2
        );
      }

      // Eyebrow scramble
      tl.fromTo(eyebrowRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.1,
          onComplete: () => {
            gsap.to(eyebrowRef.current, {
              scrambleText: { text: "// Full Stack Developer", chars: "01!@#$%^&", speed: 0.5 },
              duration: 1.0, ease: "none",
            });
          },
        },
        0.45
      );

      // Word blur + clip reveal
      const wordInners = headingRef.current?.querySelectorAll(".hero-word-inner") ?? [];
      tl.fromTo(wordInners,
        { y: "110%", clipPath: "inset(0 0 100% 0)", filter: "blur(10px)" },
        { y: "0%", clipPath: "inset(0 0 0% 0)", filter: "blur(0px)", duration: 1.0, ease: "power3.out", stagger: 0.1 },
        0.6
      );

      // CTA
      tl.fromTo(ctaRef.current,
        { y: 24, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
        "-=0.35"
      );

      // Code label float in
      tl.fromTo(codeLabelRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        1.6
      );

      // Stat pills stagger
      tl.fromTo(
        statsRef.current?.querySelectorAll(".hero-stat-item") ?? [],
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 },
        1.8
      );

      // Scroll indicator
      tl.fromTo(scrollRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[var(--bg-base)]"
    >
      {/* Dot grid atmospheric overlay */}
      <div
        ref={gridRef}
        className="hero-dot-grid absolute inset-0 z-0 pointer-events-none opacity-0"
      />

      {/* Glow orbs */}
      <div ref={orb1Ref} className="hero-orb-1 absolute -top-[15%] -left-[5%] w-[900px] h-[900px] pointer-events-none" />
      <div ref={orb2Ref} className="hero-orb-2 absolute bottom-[-10%] right-[-8%] w-[700px] h-[700px] pointer-events-none" />
      <div ref={orb3Ref} className="hero-orb-3 absolute top-[30%] left-[40%] w-[500px] h-[500px] pointer-events-none" />

      {/* Ghost "AM" */}
      <div
        ref={ghostRef}
        className="absolute right-[4vw] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-0
                   font-bold leading-none tracking-[-0.06em] font-[var(--font-heading)]
                   text-[clamp(160px,26vw,380px)] text-[var(--text-primary)]"
        aria-hidden="true"
      >
        AM
      </div>

      {/* Corner bracket — top left */}
      <svg
        ref={bracketTLRef}
        className="absolute top-[calc(var(--nav-h)+80px)] left-[var(--gutter)] w-[60px] h-[60px] z-10 pointer-events-none"
        viewBox="0 0 60 60" fill="none"
        aria-hidden="true"
      >
        <path d="M60 0 L0 0 L0 60" stroke="var(--border-strong)" strokeWidth="1" />
      </svg>

      {/* Corner bracket — bottom right */}
      <svg
        ref={bracketBRRef}
        className="absolute bottom-[calc(var(--gutter)+80px)] right-[var(--gutter)] w-[60px] h-[60px] z-10 pointer-events-none"
        viewBox="0 0 60 60" fill="none"
        aria-hidden="true"
      >
        <path d="M0 60 L60 60 L60 0" stroke="var(--border-strong)" strokeWidth="1" />
      </svg>

      {/* Decorative code label — mid left */}
      <div
        ref={codeLabelRef}
        className="absolute left-[var(--gutter)] top-[55%] -translate-y-1/2 z-10 pointer-events-none select-none opacity-0"
        aria-hidden="true"
      >
        <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--text-muted)] opacity-40 block">
          const ansh = new Developer();
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--accent)] opacity-30 block mt-1">
          // MERN · TypeScript · India
        </span>
      </div>

      {/* Top meta bar */}
      <div
        ref={topBarRef}
        className="absolute top-[calc(var(--nav-h)+28px)] left-[var(--gutter)] right-[var(--gutter)] z-10 flex justify-between items-center"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Portfolio — 2025
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] flex items-center gap-2">
          <span className="relative inline-flex items-center justify-center w-[6px] h-[6px]">
            <span className="pulse-ring" />
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#22c55e] relative z-10" />
          </span>
          Available for Work
        </span>
      </div>

      {/* Thin rule */}
      <div
        ref={ruleRef}
        className="absolute top-[calc(var(--nav-h)+64px)] left-[var(--gutter)] right-[var(--gutter)] h-px bg-[var(--border)] z-10 origin-left"
      />

      {/* Gradient sweep accent line */}
      <div
        ref={gradLineRef}
        className="hero-gradient-line absolute top-[calc(var(--nav-h)+64px)] left-[var(--gutter)] right-[var(--gutter)] h-px z-10 opacity-0"
      />

      {/* Main content — bottom aligned */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col justify-end px-[var(--gutter)] pb-[clamp(72px,10vh,120px)]"
      >
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Full Stack Developer
        </span>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="m-0 mb-8 font-bold tracking-[-0.05em] leading-[0.88] text-[clamp(48px,7vw,120px)] font-[var(--font-heading)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="hero-word-inner">{line}</span>
            </span>
          ))}
        </h1>

        {/* CTA row */}
        <div ref={ctaRef} className="flex gap-4 flex-wrap items-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-none border-[var(--border-strong)] text-[var(--text-primary)] bg-transparent hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8 transition-colors duration-200"
            onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            data-cursor="link"
          >
            Selected Work
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-none text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-transparent font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            data-cursor="link"
          >
            Get In Touch →
          </Button>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] hidden lg:block ml-2">
            India — MERN + TypeScript
          </span>
        </div>
      </div>

      {/* Stat pills — bottom left */}
      <div
        ref={statsRef}
        className="absolute bottom-[var(--gutter)] left-[var(--gutter)] z-10 flex items-center gap-6"
      >
        {STAT_ITEMS.map((s) => (
          <div key={s.label} className="hero-stat-item flex flex-col opacity-0">
            <span className="font-[var(--font-heading)] text-[22px] font-bold tracking-[-0.04em] text-[var(--text-primary)] leading-none">
              {s.value}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)] mt-1">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Scroll indicator — bottom right */}
      <div
        ref={scrollRef}
        className="absolute bottom-[var(--gutter)] right-[var(--gutter)] z-10 flex flex-col items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]"
      >
        <div className="scroll-line-anim w-px h-12 bg-[var(--text-muted)]" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
