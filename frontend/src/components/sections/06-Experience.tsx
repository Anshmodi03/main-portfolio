"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { experiences } from "@/lib/data";

export default function Experience() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Watermark parallax ──────────────────────────────────────────────
      gsap.to(watermarkRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });

      // ── 2. ScrambleText eyebrow ────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, {
          duration: 0.9,
          scrambleText: { text: "// Experience", chars: "01!#?$", speed: 0.7 },
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 80%", once: true },
        });
      }

      // ── 3. H2 SplitText chars ─────────────────────────────────────────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "chars,words" });
        gsap.fromTo(
          split.chars,
          { y: 72, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, ease: "dramatic", stagger: 0.018,
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // ── 4. DrawSVG timeline line scrub ────────────────────────────────────
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          drawSVG: "0%",
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: 1,
          },
        });
      }

      // ── 5. Cards stagger from alternating sides ───────────────────────────
      const cards = Array.from(
        sectionRef.current?.querySelectorAll(".exp-card") ?? []
      );
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          }
        );
      });

      // ── 6. Timeline dots pop in ───────────────────────────────────────────
      const dots = Array.from(
        sectionRef.current?.querySelectorAll(".exp-dot") ?? []
      );
      dots.forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)",
            scrollTrigger: { trigger: dot, start: "top 85%", once: true },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        WORK
      </span>

      <div className="relative z-10">
        {/* ── Header ── */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Experience
        </span>

        <h2
          ref={headingRef}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(48px,6vh,80px)] font-[var(--font-heading)]"
        >
          Professional Journey
        </h2>

        <Separator className="bg-[var(--border)] mb-[clamp(48px,6vh,80px)]" />

        {/* ── Timeline ── */}
        <div className="relative">
          {/* DrawSVG center line — hidden on mobile */}
          <svg
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-full w-0.5 overflow-visible hidden md:block pointer-events-none -translate-x-1/2"
          >
            <path
              ref={lineRef}
              d="M 1 0 L 1 3000"
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="flex flex-col">
            {experiences.map((exp, i) => (
              <div
                key={exp.company}
                className="exp-card grid md:grid-cols-[1fr_40px_1fr] grid-cols-[40px_1fr]"
              >
                {/* Left slot */}
                {i % 2 === 0 ? (
                  <ExpContent exp={exp} align="right" />
                ) : (
                  <div className="hidden md:block" />
                )}

                {/* Center dot */}
                <div className="flex justify-center pt-6">
                  <div className="exp-dot w-3.5 h-3.5 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-base)] shadow-[0_0_16px_rgba(251,70,13,0.5)]" />
                </div>

                {/* Right slot */}
                {i % 2 !== 0 ? (
                  <ExpContent exp={exp} align="left" />
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpContent({
  exp,
  align,
}: {
  exp: (typeof experiences)[0];
  align: "left" | "right";
}) {
  return (
    <div
      className={`bg-[var(--bg-base)] border border-[var(--border)] p-6 mb-8 md:mb-12 ${
        align === "right" ? "md:mr-6" : "md:ml-6"
      }`}
    >
      {/* Role + duration */}
      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
        <h3 className="font-[var(--font-heading)] text-[clamp(16px,1.4vw,20px)] font-bold text-[var(--text-primary)] m-0">
          {exp.role}
        </h3>
        <span className="font-mono text-[10px] text-[var(--accent)] tracking-[0.08em] shrink-0">
          {exp.duration}
        </span>
      </div>

      {/* Company */}
      <p className="font-mono text-[12px] text-[var(--accent)] tracking-[0.06em] mb-3">
        {exp.company}
      </p>

      {/* Description */}
      <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
        {exp.description}
      </p>

      {/* Achievements */}
      {exp.achievements && (
        <ul className="mb-4 pl-0 list-none">
          {exp.achievements.map((a) => (
            <li key={a} className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-1.5">
              <span className="text-[var(--accent)]">↳ </span>{a}
            </li>
          ))}
        </ul>
      )}

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5">
        {exp.tech.map((t) => (
          <Badge
            key={t}
            variant="outline"
            className="rounded-none font-mono text-[10px] tracking-[0.08em] border-[var(--border)] text-[var(--text-muted)] bg-transparent"
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}
