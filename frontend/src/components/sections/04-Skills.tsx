"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { skills, skillsByCategory, exploring } from "@/lib/data";

const LEVEL_SCALE: Record<string, number> = {
  Expert:       0.95,
  Advanced:     0.80,
  Intermediate: 0.65,
  Learning:     0.45,
};

// Pre-compute bar ref offsets per category
const CATEGORIES = [
  { key: "frontend", label: "Frontend",  skills: skillsByCategory.frontend, offset: 0 },
  { key: "backend",  label: "Backend",   skills: skillsByCategory.backend,  offset: skillsByCategory.frontend.length },
  { key: "tools",    label: "Tools",     skills: skillsByCategory.tools,    offset: skillsByCategory.frontend.length + skillsByCategory.backend.length },
] as const;

export default function Skills() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const catLineRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const barFillRefs  = useRef<(HTMLDivElement | null)[]>([]);

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
          scrambleText: { text: "// Technical Expertise", chars: "01!#?$", speed: 0.7 },
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 82%", once: true },
        });
      }

      // ── 3. H2 SplitText chars ─────────────────────────────────────────────
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "chars,words" });
        gsap.fromTo(
          split.chars,
          { y: 72, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, ease: "dramatic", stagger: 0.018,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // ── 4. Category accent lines draw in ──────────────────────────────────
      catLineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.8, ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
      });

      // ── 5. Skill rows stagger per category ────────────────────────────────
      CATEGORIES.forEach((cat) => {
        const rows = Array.from(
          sectionRef.current?.querySelectorAll(`.skill-row-${cat.key}`) ?? []
        );
        if (!rows.length) return;
        gsap.fromTo(
          rows,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: rows[0], start: "top 78%" },
          }
        );
      });

      // ── 6. Progress bars draw to level width on scroll ────────────────────
      CATEGORIES.forEach((cat) => {
        cat.skills.forEach((skill, si) => {
          const flatIdx = cat.offset + si;
          const bar = barFillRefs.current[flatIdx];
          if (!bar) return;
          gsap.fromTo(
            bar,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: LEVEL_SCALE[skill.level] ?? 0.65,
              duration: 1.0,
              ease: "power3.out",
              delay: si * 0.07,
              scrollTrigger: { trigger: bar, start: "top 88%", once: true },
            }
          );
        });
      });

      // ── 7. Exploring badges stagger ───────────────────────────────────────
      const exploreItems = Array.from(
        sectionRef.current?.querySelectorAll(".explore-item") ?? []
      );
      if (exploreItems.length) {
        gsap.fromTo(
          exploreItems,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: exploreItems[0], start: "top 80%" },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        SKILLS
      </span>

      {/* ── Header ── */}
      <div className="relative z-10">
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Technical Expertise
        </span>

        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(48px,6vh,80px)] font-[var(--font-heading)]"
        >
          Skills &amp; Tools
        </h2>
      </div>

      {/* ── Ticker strip ── */}
      <div
        className="relative z-10 overflow-hidden border-t border-b border-[var(--border)] py-4 mb-[clamp(48px,6vh,80px)]"
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

      <Separator className="bg-[var(--border)] mb-[clamp(48px,6vh,80px)] relative z-10" />

      {/* ── 3-column skill grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]">
        {CATEGORIES.map((cat, ci) => (
          <div key={cat.key} className="bg-[var(--bg-base)] px-0 md:px-8 md:first:pl-0 md:last:pr-0">
            {/* Category header */}
            <div className="pb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {cat.label}
                </p>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {cat.skills.length} skills
                </span>
              </div>
              {/* Animated accent underline */}
              <div className="relative h-px bg-[var(--border)] overflow-hidden">
                <div
                  ref={(el) => { catLineRefs.current[ci] = el; }}
                  className="absolute inset-0 bg-[var(--accent)] origin-left scale-x-0"
                />
              </div>
            </div>

            {/* Skills list */}
            <div>
              {cat.skills.map((skill, si) => {
                const flatIdx = cat.offset + si;
                return (
                  <div
                    key={skill.name}
                    className={`skill-row-${cat.key} group py-5 border-b border-[var(--border)] last:border-b-0 cursor-default`}
                  >
                    {/* Row 1: icon + name + years */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-3">
                        <span className="text-base opacity-70 select-none">{skill.icon}</span>
                        <span className="text-[clamp(14px,1.4vw,17px)] font-bold tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-200 font-[var(--font-heading)]">
                          {skill.name}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-[var(--text-muted)] shrink-0 ml-3">
                        {skill.years}
                      </span>
                    </div>

                    {/* Row 2: description (muted subtitle) */}
                    <p className="font-mono text-[10px] leading-[1.6] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3 max-w-[260px]">
                      {skill.description}
                    </p>

                    {/* Row 3: progress bar */}
                    <div className="relative h-px w-full bg-[var(--border)] mb-3 overflow-hidden">
                      <div
                        ref={(el) => { barFillRefs.current[flatIdx] = el; }}
                        className="absolute inset-0 bg-[var(--accent)] origin-left"
                      />
                    </div>

                    {/* Row 4: level badge */}
                    <Badge
                      variant="outline"
                      className="rounded-none font-mono text-[10px] tracking-[0.12em] border-[var(--border)] text-[var(--accent)] bg-transparent"
                    >
                      {skill.level}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-[var(--border)] mt-[clamp(48px,6vh,80px)] mb-[clamp(48px,6vh,80px)] relative z-10" />

      {/* ── Currently Exploring ── */}
      <div className="relative z-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-8">
          // Currently Exploring
        </p>
        <div className="flex flex-wrap gap-3">
          {exploring.map((item) => (
            <Badge
              key={item.name}
              variant="outline"
              className="explore-item rounded-none border-[var(--border)] bg-transparent font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 cursor-default px-3 py-2"
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.name}
              <span className="ml-1.5 opacity-50">· {item.status}</span>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
