"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LINES = ["BUILDING", "THE FUTURE,", "ONE LINE", "AT A TIME."];

const MOBILE_TERMINAL_LINES = [
  { type: "cmd",   text: "> npx create-portfolio --dev" },
  { type: "ok",    text: "✓ MERN + TypeScript ready"   },
  { type: "muted", text: "// Open to new opportunities" },
];

const SERVICES = [
  { role: "Frontend", stack: "React · Next.js · GSAP"   },
  { role: "Backend",  stack: "Node.js · Express · REST" },
  { role: "Database", stack: "MongoDB · TypeScript"      },
];

const TERMINAL_LINES = [
  { type: "cmd",   text: "> npx create-portfolio --stack=MERN+TS"  },
  { type: "ok",    text: "✓ React 19 + Next.js 16 + Turbopack"    },
  { type: "ok",    text: "✓ Express 5 + MongoDB Atlas connected"   },
  { type: "ok",    text: "✓ JavaScript & TypeScript strict mode"   },
  { type: "muted", text: "// Building pixel-precise experiences..." },
  { type: "cmd",   text: "> Ready on http://localhost:3000"        },
];


interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const sectionRef   = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const locationRef  = useRef<HTMLDivElement>(null);
  const orb1Ref      = useRef<HTMLDivElement>(null);
  const orb2Ref      = useRef<HTMLDivElement>(null);
  const orb3Ref      = useRef<HTMLDivElement>(null);
  const servicesRef  = useRef<HTMLDivElement>(null);
  const gridRef            = useRef<HTMLDivElement>(null);
  const terminalRef        = useRef<HTMLDivElement>(null);
  const mobileTerminalRef  = useRef<HTMLDivElement>(null);

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

      /* ── Terminal card subtle float + pulsing glow ── */
      gsap.to(terminalRef.current, {
        y: -8, duration: 6,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.3,
      });
      gsap.to(terminalRef.current, {
        boxShadow: "0 0 32px rgba(251,70,13,0.18), 0 0 64px rgba(251,70,13,0.06)",
        duration: 3,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.0,
      });

      /* ── Mouse parallax via quickTo ── */
      const xQ = [
        gsap.quickTo(orb1Ref.current, "x", { duration: 1.2, ease: "power3.out" }),
        gsap.quickTo(orb2Ref.current, "x", { duration: 1.6, ease: "power3.out" }),
        gsap.quickTo(orb3Ref.current, "x", { duration: 0.9, ease: "power3.out" }),
      ];
      const yQ = [
        gsap.quickTo(orb1Ref.current, "y", { duration: 1.2, ease: "power3.out" }),
        gsap.quickTo(orb2Ref.current, "y", { duration: 1.6, ease: "power3.out" }),
        gsap.quickTo(orb3Ref.current, "y", { duration: 0.9, ease: "power3.out" }),
      ];
      const DEPTHS = [0.04, 0.03, 0.06];

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

      // Orbs materialize — bloom outward from nothing
      tl.fromTo([orb1Ref.current, orb2Ref.current, orb3Ref.current],
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out", stagger: 0.5 },
        0
      );

      // Location badge slides in
      tl.fromTo(locationRef.current,
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.2
      );

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
        0.3
      );

      // ── Good Fella line-mask reveal ──
      const lineInners = headingRef.current?.querySelectorAll(".hero-line-inner") ?? [];
      tl.fromTo(lineInners,
        { y: "110%", rotateX: 12, filter: "blur(14px)", opacity: 0 },
        { y: "0%", rotateX: 0, filter: "blur(0px)", opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.1 },
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

      // Terminal card slides up
      tl.fromTo(terminalRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" },
        0.8
      );

      // Terminal lines — ScrambleText typewriter reveal per line
      const termLineEls = terminalRef.current?.querySelectorAll(".terminal-line") ?? [];
      termLineEls.forEach((el, i) => {
        const spanEl = el.querySelector("span");
        const originalText = TERMINAL_LINES[i].text;
        const startT = 1.0 + i * 0.38;
        tl.set(el, { opacity: 1 }, startT);
        if (spanEl) {
          tl.to(spanEl, {
            duration: 0.35,
            scrambleText: {
              text: originalText,
              chars: ">✓ abcdefghijklmnopqrstuvwxyz0123456789=-.:/",
              revealDelay: 0,
              speed: 0.7,
            },
            ease: "none",
          }, startT);
        }
      });

      // Cursor appears after last line
      const cursorDelay = 1.0 + (TERMINAL_LINES.length - 1) * 0.38 + 0.35 + 0.1;
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

      // ── Mobile: compact terminal card entrance (lg:hidden) ──
      if (mobileTerminalRef.current) {
        tl.fromTo(mobileTerminalRef.current,
          { y: 24, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" },
          "-=0.2"
        );

        // Mobile terminal lines — ScrambleText typewriter (3 lines)
        const mobileLineEls = mobileTerminalRef.current.querySelectorAll(".m-terminal-line");
        const mobileBaseT = tl.duration();
        mobileLineEls.forEach((el, i) => {
          const spanEl = el.querySelector("span");
          const originalText = MOBILE_TERMINAL_LINES[i].text;
          const startT = mobileBaseT + i * 0.38;
          tl.set(el, { opacity: 1 }, startT);
          if (spanEl) {
            tl.to(spanEl, {
              duration: 0.32,
              scrambleText: {
                text: originalText,
                chars: ">✓ abcdefghijklmnopqrstuvwxyz0123456789=-.:/",
                revealDelay: 0,
                speed: 0.7,
              },
              ease: "none",
            }, startT);
          }
        });

        // Mobile cursor
        const mobileCursorDelay = tl.duration() + 0.1;
        tl.fromTo(".m-terminal-cursor",
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          mobileCursorDelay
        );
        gsap.to(".m-terminal-cursor", {
          opacity: 0, duration: 0.55,
          ease: "steps(1)", repeat: -1, yoyo: true,
          delay: mobileCursorDelay + 0.4,
        });

        // Mobile terminal float + glow loops (outside timeline)
        gsap.to(mobileTerminalRef.current, {
          y: -5, duration: 4,
          ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5,
        });
        gsap.to(mobileTerminalRef.current, {
          boxShadow: "0 0 20px rgba(251,70,13,0.18), 0 0 40px rgba(251,70,13,0.06)",
          duration: 3,
          ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2,
        });
      }

      // Services list slides in after cursor
      const serviceItems = servicesRef.current?.querySelectorAll(".hero-service-item") ?? [];
      tl.fromTo(servicesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        cursorDelay + 0.1
      );
      tl.fromTo(serviceItems,
        { x: -14, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1 },
        cursorDelay + 0.15
      );


    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] bg-[var(--bg-base)]"
    >
      {/* ── Background layer — overflow contained here, NOT on section root ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={gridRef}
          className="hero-dot-grid absolute inset-0 z-0 opacity-0"
        />
        {/* Glow orbs */}
        <div ref={orb1Ref} className="hero-orb-1 absolute -top-[15%] -left-[5%] w-[900px] h-[900px] opacity-0" />
        <div ref={orb2Ref} className="hero-orb-2 absolute bottom-[-10%] right-[-8%] w-[700px] h-[700px] opacity-0" />
        <div ref={orb3Ref} className="hero-orb-3 absolute top-[30%] left-[30%] w-[500px] h-[500px] opacity-0" />
      </div>

      {/* ── 2-Column grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[60fr_40fr] min-h-[100dvh] pt-[var(--nav-h)]">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col px-[var(--gutter)] pt-[clamp(24px,4vh,48px)] pb-[clamp(24px,4vh,48px)]">

          {/* Main content block */}
          <div ref={contentRef} className="flex flex-col">

            {/* Location badge */}
            <div ref={locationRef} className="flex items-center gap-2 mb-6 opacity-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Full Stack Dev
              </span>
              <span className="w-px h-3 bg-[var(--border-strong)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Open to Remote
              </span>
            </div>

            {/* Heading — per-line mask reveal */}
            <h1
              ref={headingRef}
              className="hero-heading-3d m-0 mb-5 font-bold tracking-[-0.05em] leading-[0.9] text-[clamp(40px,5.5vw,88px)] font-[var(--font-heading)]"
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
              className="font-mono text-[13px] text-[var(--text-muted)] tracking-[0.02em] leading-relaxed mb-5 max-w-[480px] opacity-0"
            >
              Full Stack Developer building end-to-end web experiences with the MERN
              stack, JavaScript, TypeScript, and pixel-precise UI.
            </p>

            {/* CTA row */}
            <div ref={ctaRef} className="flex gap-4 flex-wrap items-center mb-7 opacity-0">
              {/* Primary CTA — Good Fella 3-part spinning + button */}
              <button
                type="button"
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-flex cursor-none border-none bg-transparent p-0"
                data-cursor="link"
                aria-label="Selected Work"
              >
                <span className="relative flex items-center gap-[6px]">
                  <span className="flex shrink-0 items-center justify-center w-8 h-10 origin-left -rotate-45 scale-0 bg-[var(--accent)] text-white transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:rotate-0 group-hover:scale-100">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                    </svg>
                  </span>
                  <span className="flex items-center justify-center h-10 px-6 font-mono text-[11px] uppercase tracking-[0.14em] bg-[var(--accent)] text-white -translate-x-[38px] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0">
                    Selected Work
                  </span>
                  <span className="absolute right-0 flex shrink-0 items-center justify-center w-8 h-10 origin-right bg-[var(--accent)] text-white transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45 group-hover:scale-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                    </svg>
                  </span>
                </span>
              </button>
              {/* Secondary CTA — sweeping underline */}
              <button
                type="button"
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-block cursor-none border-none bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300"
                data-cursor="link"
              >
                Get In Touch →
                <span className="pointer-events-none absolute inset-x-0 -bottom-[2px]" aria-hidden="true">
                  <span className="absolute inset-x-0 top-0 h-px bg-current origin-left scale-x-100 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] delay-300 group-hover:origin-right group-hover:scale-x-0 group-hover:delay-0" />
                  <span className="absolute inset-x-0 top-0 h-px bg-current origin-right scale-x-0 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] delay-0 group-hover:origin-left group-hover:scale-x-100 group-hover:delay-300" />
                </span>
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block cursor-none ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--border-strong)] hover:text-[var(--text-muted)] transition-colors duration-300"
                data-cursor="link"
              >
                ↗ Resume
                <span className="pointer-events-none absolute inset-x-0 -bottom-[2px]" aria-hidden="true">
                  <span className="absolute inset-x-0 top-0 h-px bg-current origin-left scale-x-100 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] delay-300 group-hover:origin-right group-hover:scale-x-0 group-hover:delay-0" />
                  <span className="absolute inset-x-0 top-0 h-px bg-current origin-right scale-x-0 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] delay-0 group-hover:origin-left group-hover:scale-x-100 group-hover:delay-300" />
                </span>
              </a>
            </div>

          </div>

          {/* ── Mobile: compact terminal — hidden on lg+ ── */}
          <div
            ref={mobileTerminalRef}
            className="lg:hidden mt-6 w-full opacity-0"
          >
            {/* Chrome bar */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] px-4 py-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="font-mono text-[9px] text-[var(--text-muted)] ml-2 tracking-[0.1em] uppercase">
                ansh@portfolio:~
              </span>
            </div>
            {/* Terminal body */}
            <div className="bg-[var(--bg-raised)] border border-t-0 border-[var(--border)] px-5 py-4 font-mono text-[11px] leading-[2.1]">
              {MOBILE_TERMINAL_LINES.map((line, i) => (
                <div key={i} className="m-terminal-line opacity-0">
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
              <span className="m-terminal-cursor inline-block w-[7px] h-[12px] bg-[var(--accent)] align-middle opacity-0" />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="hidden lg:flex flex-col relative items-center justify-center overflow-hidden py-[clamp(32px,6vh,80px)] pr-[var(--gutter)]">

          {/* Eyebrow — right side */}
          <span
            ref={eyebrowRef}
            className="absolute top-[clamp(24px,5vh,56px)] left-0 right-[var(--gutter)] text-right font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] opacity-0 z-10"
          >
            // Full Stack Developer
          </span>

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

          {/* Service list — below terminal */}
          <div ref={servicesRef} className="mt-5 w-[min(420px,85%)] flex flex-col gap-[10px] opacity-0">
            {SERVICES.map((s, i) => (
              <div key={i} className="hero-service-item flex items-center gap-3 opacity-0">
                <span className="font-mono text-[10px] text-[var(--accent)] tracking-[0.1em] select-none">//</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {s.role}
                </span>
                <span className="w-px h-3 bg-[var(--border-strong)] shrink-0" />
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--border-strong)]">
                  {s.stack}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
