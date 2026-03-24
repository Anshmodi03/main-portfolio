"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { exploring } from "@/lib/data";

const STATUS_STYLE: Record<string, string> = {
  Learning:   "border-[var(--accent)] text-[var(--accent)]",
  Exploring:  "border-[var(--border-strong)] text-[var(--text-muted)]",
  Interested: "border-[var(--border)] text-[var(--text-muted)] opacity-60",
};

export default function Exploring() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  // Per-row accent line refs
  const accentRefs   = useRef<(HTMLDivElement | null)[]>([]);

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

      // ── 2. Eyebrow ScrambleText ────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, {
          duration: 0.9,
          scrambleText: { text: "// Exploration", chars: "01!#?$", speed: 0.7 },
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

      // ── 4. Separator scaleX draw ───────────────────────────────────────────
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1.0, ease: "power3.out",
            scrollTrigger: { trigger: lineRef.current, start: "top 80%", once: true },
          }
        );
      }

      // ── 5. Row slide-in stagger ────────────────────────────────────────────
      const rows = Array.from(sectionRef.current?.querySelectorAll(".explore-row") ?? []);
      if (rows.length) {
        gsap.fromTo(
          rows,
          { x: -32, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.07,
            scrollTrigger: { trigger: rows[0], start: "top 78%", once: true },
          }
        );
      }

      // ── 6. Badge pop stagger ───────────────────────────────────────────────
      const badges = Array.from(sectionRef.current?.querySelectorAll(".explore-badge") ?? []);
      if (badges.length) {
        gsap.fromTo(
          badges,
          { y: 14, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)", stagger: 0.05,
            scrollTrigger: { trigger: badges[0], start: "top 80%", once: true },
          }
        );
      }

      // ── 7. Per-row accent line draws on scroll ─────────────────────────────
      exploring.forEach((_, i) => {
        const el = accentRefs.current[i];
        if (!el) return;
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="exploring"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        EXPLORE
      </span>

      <div className="relative z-10">
        {/* ── Header ── */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Exploration
        </span>

        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(40px,5vh,72px)] font-[var(--font-heading)]"
        >
          Currently Exploring
        </h2>

        {/* Animated separator */}
        <div className="relative h-px bg-[var(--border)] overflow-hidden mb-[clamp(48px,6vh,80px)]">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-[var(--accent)] origin-left"
          />
        </div>

        {/* ── Item list ── */}
        <div>
          {exploring.map((item, i) => (
            <div
              key={item.name}
              className="explore-row group relative"
            >
              {/* Top accent line — draws in on scroll */}
              {i === 0 && (
                <div className="relative h-px bg-[var(--border)] overflow-hidden mb-0">
                  <div
                    ref={(el) => { accentRefs.current[i] = el; }}
                    className="absolute inset-0 bg-[var(--accent)] origin-left"
                  />
                </div>
              )}

              {/* Row content */}
              <div className="grid grid-cols-[clamp(40px,4vw,64px)_1fr_auto] gap-6 items-center py-7 border-b border-[var(--border)]">

                {/* Index */}
                <span className="font-mono text-[clamp(11px,1vw,14px)] text-[var(--text-muted)] tabular-nums select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name + icon */}
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    aria-hidden="true"
                    className="text-[clamp(16px,1.8vw,22px)] opacity-50 select-none shrink-0"
                  >
                    {item.icon}
                  </span>
                  <span className="font-[var(--font-heading)] text-[clamp(20px,3vw,48px)] font-bold tracking-[-0.03em] leading-[1.05] group-hover:text-[var(--accent)] transition-colors duration-200 truncate">
                    {item.name}
                  </span>
                </div>

                {/* Status badge */}
                <Badge
                  variant="outline"
                  className={`explore-badge rounded-none font-mono text-[9px] tracking-[0.12em] bg-transparent shrink-0 ${STATUS_STYLE[item.status] ?? STATUS_STYLE.Interested}`}
                >
                  {item.status}
                </Badge>
              </div>

              {/* Bottom accent line draws in for subsequent rows */}
              {i > 0 && (
                <div className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
                  <div
                    ref={(el) => { accentRefs.current[i] = el; }}
                    className="absolute inset-0 bg-[var(--accent)] origin-left opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-[clamp(32px,4vh,56px)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--border-strong)]">
            Always learning · always building
          </p>
        </div>
      </div>
    </section>
  );
}
