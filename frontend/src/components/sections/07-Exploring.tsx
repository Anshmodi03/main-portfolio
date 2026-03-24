"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { exploring } from "@/lib/data";

// ── Status config ───────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  Learning:   "border-[var(--accent)] text-[var(--accent)]",
  Exploring:  "border-[var(--border-strong)] text-[var(--text-muted)]",
  Interested: "border-[var(--border)] text-[var(--text-muted)] opacity-60",
};

const STATUS_DOT: Record<string, string> = {
  Learning:   "bg-[var(--accent)]",
  Exploring:  "bg-[var(--border-strong)]",
  Interested: "bg-[var(--border)]",
};

const TOOLTIP_MSG: Record<string, string> = {
  Learning:   "Actively learning — building real projects",
  Exploring:  "Researching concepts and reading deeply",
  Interested: "On the radar — planning to explore soon",
};

// ── Component ───────────────────────────────────────────────────────────────

export default function Exploring() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
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

      // ── 5. Card entrance stagger ───────────────────────────────────────────
      const cards = Array.from(sectionRef.current?.querySelectorAll(".explore-card") ?? []);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.75, ease: "back.out(1.2)", stagger: 0.07,
            scrollTrigger: { trigger: cards[0], start: "top 78%", once: true },
          }
        );
      }

      // ── 6. Per-card accent line scaleX stagger ────────────────────────────
      const accents = accentRefs.current.filter(Boolean);
      if (accents.length) {
        gsap.fromTo(
          accents,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: cards[0], start: "top 78%", once: true },
          }
        );
      }

      // ── 7. Learning dots pulse loop ────────────────────────────────────────
      const learningDots = Array.from(
        sectionRef.current?.querySelectorAll(".explore-dot--learning") ?? []
      );
      if (learningDots.length) {
        gsap.to(learningDots, {
          scale: 2.2,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 0.4,
          stagger: 0.3,
        });
      }

      // ── 8. Card hover lift via quickTo ────────────────────────────────────
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const yQ = gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" });
        card.addEventListener("mouseenter", () => yQ(-8));
        card.addEventListener("mouseleave", () => yQ(0));
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

        {/* ── Card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)]">
          {exploring.map((item, i) => (
            <Card
              key={item.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="explore-card rounded-none border-0 bg-[var(--bg-surface)] relative overflow-hidden cursor-default"
            >
              {/* Top 2px accent line — GSAP scaleX draw */}
              <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-10">
                <div
                  ref={(el) => { accentRefs.current[i] = el; }}
                  className="explore-accent absolute inset-0 bg-[var(--accent)] origin-left"
                />
              </div>

              {/* Ghost background icon */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -bottom-4 -right-4 text-[120px] leading-none opacity-[0.05] z-0"
              >
                {item.icon}
              </span>

              {/* ── CardHeader: index + status badge ── */}
              <CardHeader className="rounded-none px-6 pt-8 pb-0 flex-row items-start justify-between gap-4">
                <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default border-none bg-transparent p-0">
                      <Badge
                        variant="outline"
                        className={`rounded-none font-mono text-[9px] tracking-[0.12em] bg-transparent ${STATUS_BADGE[item.status] ?? STATUS_BADGE.Interested}`}
                      >
                        {item.status}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent
                      className="rounded-none font-mono text-[10px] tracking-[0.08em] bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border)]"
                    >
                      {TOOLTIP_MSG[item.status] ?? TOOLTIP_MSG.Interested}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>

              {/* ── CardContent: icon + name ── */}
              <CardContent className="px-6 pt-6 pb-6 relative z-10">
                <span
                  aria-hidden="true"
                  className="text-[clamp(28px,3vw,40px)] leading-none block mb-4 select-none"
                >
                  {item.icon}
                </span>
                <h3 className="font-[var(--font-heading)] text-[clamp(18px,2vw,26px)] font-bold tracking-[-0.02em] leading-[1.15] text-[var(--text-primary)]">
                  {item.name}
                </h3>
              </CardContent>

              {/* ── CardFooter: status dot + label ── */}
              <CardFooter className="rounded-none border-t border-[var(--border)] bg-transparent px-6 py-4 flex items-center gap-2.5">
                <span
                  className={`explore-dot${item.status === "Learning" ? " explore-dot--learning" : ""} w-[6px] h-[6px] rounded-full shrink-0 ${STATUS_DOT[item.status] ?? STATUS_DOT.Interested}`}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {item.status}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-[clamp(32px,4vh,56px)] flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--border-strong)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--border-strong)]">
            Always learning · always building
          </p>
        </div>
      </div>
    </section>
  );
}
