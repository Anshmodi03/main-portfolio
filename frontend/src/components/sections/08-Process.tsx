"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { processSteps } from "@/lib/data";

// ── Step tooltips ────────────────────────────────────────────────────────────

const STEP_TOOLTIP = [
  "Discovery & requirements gathering",
  "Architecture & technical design",
  "Development & iterative sprints",
  "Deployment & client handoff",
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Process() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const accentRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

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
          scrambleText: { text: "// Process", chars: "01!#?$", speed: 0.7 },
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
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: "back.out(1.2)", stagger: 0.09,
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
            scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: cards[0], start: "top 78%", once: true },
          }
        );
      }

      // ── 7. Per-card content stagger ────────────────────────────────────────
      cards.forEach((card) => {
        const targets = card?.querySelectorAll(".process-reveal") ?? [];
        if (targets.length) {
          gsap.fromTo(
            targets,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
              scrollTrigger: { trigger: card, start: "top 80%", once: true },
            }
          );
        }
      });

      // ── 8. Footer progress lines scaleX stagger ───────────────────────────
      const progLines = progressRefs.current.filter(Boolean);
      if (progLines.length) {
        gsap.fromTo(
          progLines,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: cards[0], start: "top 78%", once: true },
          }
        );
      }

      // ── 9. Final step dot pulse loop ───────────────────────────────────────
      const deliverDot = sectionRef.current?.querySelector(".process-dot--deliver");
      if (deliverDot) {
        gsap.to(deliverDot, {
          scale: 2.4, opacity: 0,
          duration: 1.2, ease: "power2.out",
          repeat: -1, repeatDelay: 0.6,
        });
      }

      // ── 10. 3D tilt + magic radial glow per card ──────────────────────────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const glow = glowRefs.current[i];

        const rotYQ = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
        const rotXQ = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          rotYQ((px - 0.5) * 8);
          rotXQ(-(py - 0.5) * 8);
          if (glow) {
            gsap.set(glow, {
              background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(251,70,13,0.20), transparent 65%)`,
            });
          }
        };

        const onEnter = () => {
          if (glow) gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(card, { boxShadow: "inset 0 0 0 1px rgba(251,70,13,0.45)", duration: 0.3 });
        };

        const onLeave = () => {
          rotYQ(0);
          rotXQ(0);
          if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
          gsap.to(card, { boxShadow: "inset 0 0 0 1px rgba(34,34,34,0)", duration: 0.5 });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isLastStep = (i: number) => i === processSteps.length - 1;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        PROCESS
      </span>

      <div className="relative z-10">
        {/* ── Header ── */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Process
        </span>

        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(40px,5vh,72px)] font-[var(--font-heading)]"
        >
          How I Work
        </h2>

        {/* Animated separator */}
        <div className="relative h-px bg-[var(--border)] overflow-hidden mb-[clamp(48px,6vh,80px)]">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-[var(--accent)] origin-left"
          />
        </div>

        {/* ── 2×2 Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)] border border-[var(--border)] [perspective:1200px]">
          {processSteps.map((step, i) => (
            <Card
              key={step.number}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="process-card rounded-none border-0 ring-0 bg-[var(--bg-surface)] relative overflow-hidden cursor-default flex flex-col gap-0 p-0"
            >
              {/* Top 2px accent line — GSAP scaleX draw */}
              <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-10">
                <div
                  ref={(el) => { accentRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[var(--accent)] origin-left"
                />
              </div>

              {/* Magic glow overlay */}
              <div
                ref={(el) => { glowRefs.current[i] = el; }}
                className="absolute inset-0 z-[1] opacity-0 pointer-events-none"
              />

              {/* Ghost background icon */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -bottom-4 -right-4 text-[160px] leading-none opacity-[0.04] z-0"
              >
                {step.icon}
              </span>

              {/* Ghost step number */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute bottom-[72px] left-4 font-[var(--font-heading)] font-bold leading-none text-[var(--text-primary)] opacity-[0.06] text-[clamp(72px,9vw,120px)] z-0"
              >
                {step.number}
              </span>

              {/* ── CardHeader: step label badge ── */}
              <CardHeader className="rounded-none px-6 pt-8 pb-0 flex-row items-start justify-end gap-4 relative z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default border-none bg-transparent p-0">
                      <Badge
                        variant="outline"
                        className="rounded-none font-mono text-[9px] tracking-[0.12em] bg-transparent border-[var(--border-strong)] text-[var(--text-muted)]"
                      >
                        STEP {step.number}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-none font-mono text-[10px] tracking-[0.08em] bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border)]">
                      {STEP_TOOLTIP[i] ?? ""}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>

              {/* ── CardContent: icon + title + separator + description ── */}
              <CardContent className="px-6 pt-6 pb-6 relative z-10 flex-1 flex flex-col">
                <span
                  aria-hidden="true"
                  className="process-reveal text-[clamp(28px,3vw,40px)] leading-none block mb-5 select-none"
                >
                  {step.icon}
                </span>
                <h3 className="process-reveal font-[var(--font-heading)] text-[clamp(22px,2.5vw,36px)] font-bold tracking-[-0.03em] leading-[1.1] text-[var(--text-primary)] mb-4">
                  {step.title}
                </h3>
                <div className="process-reveal mb-4">
                  <Separator className="bg-[var(--border)]" />
                </div>
                <p className="process-reveal text-[14px] leading-[1.75] text-[var(--text-muted)] flex-1">
                  {step.description}
                </p>
              </CardContent>

              {/* ── CardFooter: phase progress ── */}
              <CardFooter className="rounded-none border-t border-[var(--border)] bg-transparent px-6 py-4 flex items-center gap-3 relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)] shrink-0">
                  Phase {i + 1} of {processSteps.length}
                </span>
                <div className="flex-1 h-px bg-[var(--border)] relative overflow-hidden">
                  <div
                    ref={(el) => { progressRefs.current[i] = el; }}
                    className="absolute inset-0 bg-[var(--border-strong)] origin-left"
                  />
                </div>
                <span
                  className={`${isLastStep(i) ? "process-dot--deliver bg-[var(--accent)]" : "bg-[var(--border-strong)]"} w-[6px] h-[6px] rounded-full shrink-0`}
                />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-[clamp(32px,4vh,56px)] flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--border-strong)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--border-strong)]">
            Structured process · consistent results
          </p>
        </div>
      </div>
    </section>
  );
}
