"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import LaserFlow from "@/components/ui/LaserFlow";

const LINES = ["BUILDING", "THE FUTURE,", "ONE LINE", "AT A TIME."];

const STAT_ITEMS = [
  { value: "40+", raw: 40, label: "Projects" },
  { value: "1+",  raw: 1,  label: "Yr Exp"   },
  { value: "∞",   raw: 0,  label: "Learning" },
];

const TERMINAL_LINES = [
  { type: "cmd",   text: "> npx create-portfolio --stack=MERN" },
  { type: "ok",    text: "✓ React 19 + Next.js 16 installed"   },
  { type: "ok",    text: "✓ Express 5 + MongoDB Atlas ready"   },
  { type: "ok",    text: "✓ TypeScript strict mode enabled"    },
  { type: "muted", text: "// Crafting digital experiences..."  },
  { type: "cmd",   text: "> Server running on localhost:3000"  },
];

const TECH_TAGS = ["React", "Next.js", "Node.js", "MongoDB", "TypeScript"];

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const sectionRef   = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const availableRef = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const techStripRef = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const ghostRef     = useRef<HTMLDivElement>(null);
  const orb1Ref      = useRef<HTMLDivElement>(null);
  const orb2Ref      = useRef<HTMLDivElement>(null);
  const orb3Ref      = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const terminalRef  = useRef<HTMLDivElement>(null);

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
        scale: 1.03, duration: 8,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      /* ── Terminal card subtle float ── */
      gsap.to(terminalRef.current, {
        y: -12, duration: 6,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5,
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

        if (headingRef.current) {
          const rx = ((e.clientY / window.innerHeight) - 0.5) *  2.5;
          const ry = ((e.clientX / window.innerWidth)  - 0.5) * -2.5;
          gsap.to(headingRef.current, {
            rotateX: rx, rotateY: ry,
            duration: 0.9, ease: "power3.out", transformPerspective: 800,
          });
        }
      };

      const onMouseLeave = () => {
        DEPTHS.forEach((_, i) => { xQ[i](0); yQ[i](0); });
        gsap.to(headingRef.current, {
          rotateX: 0, rotateY: 0, duration: 1.2, ease: "power3.out",
        });
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
          if (terminalRef.current) gsap.set(terminalRef.current, { y: -p * 25 });
          if (contentRef.current)  gsap.set(contentRef.current,  { y: -p * 70, opacity: 1 - p * 1.2 });
        },
      });

      /* ── Entrance timeline ── */
      const tl = gsap.timeline();

      // Dot grid atmospheric fade
      tl.fromTo(gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: "power1.out" },
        0
      );

      // Ghost AM materialise
      tl.fromTo(ghostRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 0.04, scale: 1, duration: 2.4, ease: "power1.out" },
        0
      );

      // Available for Work badge — slides up before eyebrow
      tl.fromTo(availableRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.3
      );

      // Eyebrow scramble (delayed after badge)
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
        0.55
      );

      // ── Good Fella line-mask reveal ──
      const lineInners = headingRef.current?.querySelectorAll(".hero-line-inner") ?? [];
      tl.fromTo(lineInners,
        { y: "110%", rotateX: 12 },
        { y: "0%", rotateX: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 },
        0.5
      );

      // Sub-text reveal
      tl.fromTo(subRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // CTA
      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

      // Tech strip
      tl.fromTo(techStripRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.35"
      );

      // Terminal card slides up
      tl.fromTo(terminalRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" },
        0.8
      );

      // Terminal lines stagger in
      const termLines = terminalRef.current?.querySelectorAll(".terminal-line") ?? [];
      tl.fromTo(termLines,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.18, ease: "power3.out" },
        1.0
      );

      // Cursor appears after last line
      const cursorDelay = 1.0 + 0.18 * TERMINAL_LINES.length;
      tl.fromTo(".terminal-cursor",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        cursorDelay
      );
      // Blink loop after entrance
      gsap.to(".terminal-cursor", {
        opacity: 0, duration: 0.55,
        ease: "steps(1)", repeat: -1, yoyo: true,
        delay: cursorDelay + 0.4,
      });

      // Stat pills stagger + count-up on numeric values
      const statItems = statsRef.current?.querySelectorAll(".hero-stat-item") ?? [];
      tl.fromTo(statItems,
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08,
          onStart() {
            statsRef.current?.querySelectorAll<HTMLElement>(".stat-value-num").forEach((el) => {
              const target = Number(el.getAttribute("data-target"));
              if (!isNaN(target) && target > 0) {
                const proxy = { val: 0 };
                gsap.to(proxy, {
                  val: target, duration: 1.2, ease: "power2.out",
                  onUpdate() { el.textContent = Math.round(proxy.val) + "+"; },
                });
              }
            });
          },
        },
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
      {/* ── Background layers ── */}
      <LaserFlow
        color="#fb460d"
        wispDensity={1.0}
        fogIntensity={0.28}
        mouseTiltStrength={0.035}
        flowSpeed={0.3}
        flowStrength={0.2}
      />

      <div
        ref={gridRef}
        className="hero-dot-grid absolute inset-0 z-0 pointer-events-none opacity-0"
      />

      {/* Glow orbs */}
      <div ref={orb1Ref} className="hero-orb-1 absolute -top-[15%] -left-[5%] w-[900px] h-[900px] pointer-events-none" />
      <div ref={orb2Ref} className="hero-orb-2 absolute bottom-[-10%] right-[-8%] w-[700px] h-[700px] pointer-events-none" />
      <div ref={orb3Ref} className="hero-orb-3 absolute top-[30%] left-[30%] w-[500px] h-[500px] pointer-events-none" />

      {/* ── 2-Column grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[60fr_40fr] min-h-[100dvh] pt-[var(--nav-h)]">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-between px-[var(--gutter)] py-[clamp(40px,8vh,100px)]">

          {/* Main content block */}
          <div ref={contentRef} className="flex flex-col">

            {/* Available for Work badge — above eyebrow */}
            <div ref={availableRef} className="flex items-center gap-2.5 mb-8 opacity-0">
              <span className="relative inline-flex items-center justify-center w-[6px] h-[6px]">
                <span className="pulse-ring" />
                <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#22c55e] relative z-10" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#22c55e]">
                Available for Work
              </span>
            </div>

            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-8 block opacity-0"
            >
              // Full Stack Developer
            </span>

            {/* Heading — per-line mask reveal */}
            <h1
              ref={headingRef}
              className="hero-heading-3d m-0 mb-6 font-bold tracking-[-0.05em] leading-[0.88] text-[clamp(52px,7vw,110px)] font-[var(--font-heading)]"
            >
              {LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="hero-line-inner block">{line}</span>
                </span>
              ))}
            </h1>

            {/* Sub-text */}
            <p
              ref={subRef}
              className="font-mono text-[13px] text-[var(--text-muted)] tracking-[0.02em] leading-relaxed mb-10 max-w-[480px] opacity-0"
            >
              Full Stack Developer based in India. Building end-to-end web experiences
              with the MERN stack, TypeScript, and pixel-precise UI.
            </p>

            {/* CTA row — Good Fella style */}
            <div ref={ctaRef} className="flex gap-4 flex-wrap items-center mb-12 opacity-0">
              <button
                type="button"
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-3 bg-[var(--accent)] text-white font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8 rounded-none transition-colors duration-200 hover:bg-[var(--accent-hover)] cursor-none"
                data-cursor="link"
              >
                Selected Work
                <span className="inline-flex items-center justify-center w-5 h-5 border border-white/30 rounded-full text-[10px] font-bold leading-none">
                  +
                </span>
              </button>
              <button
                type="button"
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 underline-offset-4 hover:underline cursor-none"
                data-cursor="link"
              >
                Get In Touch →
              </button>
            </div>

            {/* Tech strip */}
            <div ref={techStripRef} className="flex items-center gap-3 flex-wrap opacity-0">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Built with
              </span>
              {TECH_TAGS.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent)] border border-[var(--border)] px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stat row — bottom of left column */}
          <div ref={statsRef} className="flex items-center gap-8 mt-8 pt-8 border-t border-[var(--border)]">
            {STAT_ITEMS.map((s) => (
              <div key={s.label} className="hero-stat-item flex flex-col opacity-0">
                <span
                  className="stat-value-num font-[var(--font-heading)] text-[28px] font-bold tracking-[-0.04em] text-[var(--text-primary)] leading-none"
                  data-target={s.raw}
                >
                  {s.value}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)] mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden py-[clamp(40px,8vh,100px)] pr-[var(--gutter)]">

          {/* Ghost "AM" — subtle background texture in right col */}
          <div
            ref={ghostRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0 z-0"
            aria-hidden="true"
          >
            <span
              className="hero-ghost-am-text font-bold tracking-[-0.06em] font-[var(--font-heading)] leading-none text-[var(--text-primary)]"
            >
              AM
            </span>
          </div>

          {/* Terminal code card */}
          <div
            ref={terminalRef}
            className="relative z-10 w-[min(420px,85%)] opacity-0"
          >
            {/* Terminal chrome */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="font-mono text-[10px] text-[var(--text-muted)] ml-2 tracking-[0.1em] uppercase">
                ansh@portfolio:~
              </span>
            </div>
            {/* Terminal body */}
            <div className="bg-[var(--bg-raised)] border border-t-0 border-[var(--border)] p-6 font-mono text-[12px] leading-[2.2] min-h-[260px]">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} className="terminal-line opacity-0">
                  <span
                    className={
                      line.type === "cmd"
                        ? "text-[var(--accent)]"
                        : line.type === "ok"
                        ? "text-[#22c55e]"
                        : "text-[var(--text-muted)]"
                    }
                  >
                    {line.text}
                  </span>
                </div>
              ))}
              <span className="terminal-cursor inline-block w-[8px] h-[14px] bg-[var(--accent)] align-middle opacity-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — absolute bottom right */}
      <div
        ref={scrollRef}
        className="absolute bottom-[var(--gutter)] right-[var(--gutter)] z-10 flex flex-col items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] opacity-0"
      >
        <div className="scroll-line-anim w-px h-12 bg-[var(--text-muted)]" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
