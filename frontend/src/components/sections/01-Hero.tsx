"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Button } from "@/components/ui/button";

const LINES = ["BUILDING", "THE FUTURE,", "ONE LINE", "AT A TIME."];

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const topBarRef  = useRef<HTMLDivElement>(null);
  const ruleRef    = useRef<HTMLDivElement>(null);
  const ghostRef   = useRef<HTMLDivElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      // Ambient orb float — infinite loop
      gsap.to(orb1Ref.current, {
        y: -50, x: 25, duration: 9,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      gsap.to(orb2Ref.current, {
        y: 40, x: -35, duration: 12,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5,
      });

      const tl = gsap.timeline();

      // Ghost "AM" fade in (very subtle)
      tl.fromTo(ghostRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 0.035, scale: 1, duration: 2.2, ease: "power1.out" },
        0
      );

      // Top meta bar slide down
      tl.fromTo(topBarRef.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.1
      );

      // Horizontal rule expand from left
      tl.fromTo(ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power3.inOut" },
        0.2
      );

      // Eyebrow scramble in
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.1,
          onComplete: () => {
            gsap.to(eyebrowRef.current, {
              scrambleText: {
                text: "// Full Stack Developer",
                chars: "01!@#$%^&",
                speed: 0.5,
              },
              duration: 1.0,
              ease: "none",
            });
          },
        },
        0.45
      );

      // Word-by-word: blur + clip reveal from bottom
      const wordInners = headingRef.current?.querySelectorAll(".hero-word-inner") ?? [];
      tl.fromTo(
        wordInners,
        { y: "110%", clipPath: "inset(0 0 100% 0)", filter: "blur(10px)" },
        {
          y: "0%", clipPath: "inset(0 0 0% 0)", filter: "blur(0px)",
          duration: 1.0, ease: "power3.out", stagger: 0.1,
        },
        0.6
      );

      // CTA fade + blur up
      tl.fromTo(ctaRef.current,
        { y: 24, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
        "-=0.35"
      );

      // Scroll indicator
      tl.fromTo(scrollRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      // Scroll-driven parallax on content
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=80%",
        scrub: 1,
        onUpdate: (self) => {
          if (contentRef.current) {
            gsap.set(contentRef.current, {
              y: -self.progress * 80,
              opacity: 1 - self.progress * 1.3,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[var(--bg-base)]"
    >
      {/* Glow orbs — GSAP floats these */}
      <div
        ref={orb1Ref}
        className="hero-orb-1 absolute -top-[15%] -left-[5%] w-[900px] h-[900px] pointer-events-none"
      />
      <div
        ref={orb2Ref}
        className="hero-orb-2 absolute bottom-[-10%] right-[-8%] w-[700px] h-[700px] pointer-events-none"
      />

      {/* Ghost "AM" — large background typography, GSAP fades in */}
      <div
        ref={ghostRef}
        className="absolute right-[4vw] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-0
                   font-bold leading-none tracking-[-0.06em] font-[var(--font-heading)]
                   text-[clamp(160px,26vw,380px)] text-[var(--text-primary)]"
        aria-hidden="true"
      >
        AM
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
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#22c55e]" />
          Available for Work
        </span>
      </div>

      {/* Thin rule — GSAP scaleX 0→1 from left */}
      <div
        ref={ruleRef}
        className="absolute top-[calc(var(--nav-h)+64px)] left-[var(--gutter)] right-[var(--gutter)] h-px bg-[var(--border)] z-10 origin-left"
      />

      {/* Main content — bottom aligned */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col justify-end px-[var(--gutter)] pb-[clamp(72px,10vh,120px)]"
      >
        {/* Eyebrow — scrambled in by GSAP */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Full Stack Developer
        </span>

        {/* Heading — fixed clamp to prevent overflow */}
        <h1
          ref={headingRef}
          className="m-0 mb-8 font-bold tracking-[-0.05em] leading-[0.88] text-[clamp(48px,7vw,120px)] font-[var(--font-heading)]"
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

      {/* Scroll indicator — absolute bottom right */}
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
