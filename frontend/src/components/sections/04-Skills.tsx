"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data";

const LEVEL_W: Record<string, string> = {
  Expert:       "w-[95%]",
  Advanced:     "w-[80%]",
  Intermediate: "w-[65%]",
  Learning:     "w-[45%]",
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // H2 SplitText line reveal
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert() }
        );
      }

      // List rows stagger fade-up
      gsap.fromTo(
        listRef.current?.querySelectorAll(".skills-row") ?? [],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.04,
          scrollTrigger: { trigger: listRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block">
        // Technical Expertise
      </p>

      <h2
        ref={h2Ref}
        className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(64px,8vh,120px)] font-[var(--font-heading)]"
      >
        Skills &amp; Tools
      </h2>

      {/* ── Ticker strip ── */}
      <div
        className="overflow-hidden border-t border-b border-[var(--border)] py-4 mb-[clamp(64px,8vh,120px)]"
        aria-hidden="true"
      >
        <div className="ticker-track flex w-max items-center">
          {[...skills, ...skills].map((s, i) => (
            <span
              key={i}
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--text-muted)] px-8 whitespace-nowrap"
            >
              {s.name}
              <span className="text-[var(--accent)] text-[8px] ml-8">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Typographic list ── */}
      <div ref={listRef} className="border-t border-[var(--border)]">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="skills-row group relative flex items-center justify-between py-5 border-b border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200 overflow-hidden"
            data-cursor="link"
          >
            {/* Hover tint overlay */}
            <div className="absolute inset-0 bg-[rgba(251,70,13,0.04)] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none" />

            {/* Left: icon + name */}
            <div className="flex items-center gap-5 z-10">
              <span className="text-xl opacity-70 select-none">{skill.icon}</span>
              <span className="text-[clamp(18px,2.5vw,28px)] font-bold tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-200 font-[var(--font-heading)]">
                {skill.name}
              </span>
            </div>

            {/* Right: progress bar + badge + years */}
            <div className="flex items-center gap-6 z-10">
              {/* Progress bar — hover reveal */}
              <div className="relative w-20 h-px bg-[var(--border)] overflow-hidden hidden md:block">
                <div
                  className={`absolute inset-y-0 left-0 h-full bg-[var(--accent)] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-out ${LEVEL_W[skill.level] ?? "w-[65%]"}`}
                />
              </div>
              <Badge
                variant="outline"
                className="rounded-none font-mono text-[10px] tracking-[0.12em] border-[var(--border)] text-[var(--accent)] bg-transparent"
              >
                {skill.level}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] hidden sm:block">
                {skill.years}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
