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
import { exploring } from "@/lib/data";

// ── Status config ────────────────────────────────────────────────────────────

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

// ── Asymmetric bento layout ──────────────────────────────────────────────────
//
//  ┌─────────────────┬──────────┬──────────┐
//  │  ML  (tall)     │  AI      │  DevOps  │
//  │  col-1 row-2    ├──────────┴──────────┤
//  │                 │ Blockchain  (wide)   │
//  ├─────────────────┼──────────┬──────────┤
//  │  Cybersecurity  │  AR/VR   │ Game Dev │
//  └─────────────────┴──────────┴──────────┘

const BENTO: { col: string; row: string }[] = [
  { col: "lg:col-span-1", row: "lg:row-span-2" }, // 0 — ML (tall)
  { col: "lg:col-span-1", row: "lg:row-span-1" }, // 1 — AI
  { col: "lg:col-span-1", row: "lg:row-span-1" }, // 2 — DevOps
  { col: "lg:col-span-2", row: "lg:row-span-1" }, // 3 — Blockchain (wide)
  { col: "lg:col-span-1", row: "lg:row-span-1" }, // 4 — Cybersecurity
  { col: "lg:col-span-1", row: "lg:row-span-1" }, // 5 — AR/VR
  { col: "lg:col-span-1", row: "lg:row-span-1" }, // 6 — Game Dev
];

const BLOCKCHAIN_TAGS = ["Web3", "DeFi", "Smart Contracts", "Layer 2"];

const TALL_DESCRIPTIONS: Record<string, string> = {
  "Machine Learning": "Algorithms, neural networks & model training",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function Exploring() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs     = useRef<(HTMLDivElement | null)[]>([]);
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
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: "back.out(1.4)", stagger: 0.08,
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
            scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.09,
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
          scale: 2.2, opacity: 0,
          duration: 1.2, ease: "power2.out",
          repeat: -1, repeatDelay: 0.4, stagger: 0.3,
        });
      }

      // ── 8. 3D tilt + magic radial glow per card ───────────────────────────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const glow = glowRefs.current[i];

        const rotYQ = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
        const rotXQ = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          rotYQ((px - 0.5) * 10);
          rotXQ(-(py - 0.5) * 10);
          if (glow) {
            gsap.set(glow, {
              background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(251,70,13,0.22), transparent 65%)`,
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

  const isTall = (i: number) => BENTO[i]?.row === "lg:row-span-2";
  const isWide = (i: number) => BENTO[i]?.col === "lg:col-span-2";

  const statusBadge = (item: (typeof exploring)[0]) => (
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
        <TooltipContent className="rounded-none font-mono text-[10px] tracking-[0.08em] bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border)]">
          {TOOLTIP_MSG[item.status] ?? TOOLTIP_MSG.Interested}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const statusFooter = (item: (typeof exploring)[0]) => (
    <div className="border-t border-[var(--border)] px-6 py-4 flex items-center gap-2.5 relative z-10">
      <span
        className={`explore-dot${item.status === "Learning" ? " explore-dot--learning" : ""} w-[6px] h-[6px] rounded-full shrink-0 ${STATUS_DOT[item.status] ?? STATUS_DOT.Interested}`}
      />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {item.status}
      </span>
    </div>
  );

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

        {/* ── Magic Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,auto)] lg:auto-rows-[minmax(240px,auto)] gap-[1px] bg-[var(--border)] border border-[var(--border)] [perspective:1200px]">
          {exploring.map((item, i) => (
            <Card
              key={item.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`${BENTO[i]?.col ?? ""} ${BENTO[i]?.row ?? ""} explore-card rounded-none border-0 ring-0 bg-[var(--bg-surface)] relative overflow-hidden cursor-default flex flex-col gap-0 p-0`}
            >
              {/* Top 2px accent line — GSAP scaleX draw */}
              <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-10">
                <div
                  ref={(el) => { accentRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[var(--accent)] origin-left"
                />
              </div>

              {/* Magic glow overlay — GSAP radial-gradient tracking cursor */}
              <div
                ref={(el) => { glowRefs.current[i] = el; }}
                className="absolute inset-0 z-[1] opacity-0 pointer-events-none"
              />

              {/* Ghost background icon */}
              <span
                aria-hidden="true"
                className={`pointer-events-none select-none absolute -bottom-4 -right-4 leading-none z-0 ${
                  isTall(i) ? "opacity-[0.04] text-[160px]" : isWide(i) ? "opacity-[0.04] text-[140px]" : "opacity-[0.05] text-[120px]"
                }`}
              >
                {item.icon}
              </span>

              {/* ── TALL CARD (index 0 — ML) ── */}
              {isTall(i) ? (
                <>
                  <CardHeader className="rounded-none px-6 pt-8 pb-0 flex-row items-start justify-between gap-4 relative z-10">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums select-none leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {statusBadge(item)}
                  </CardHeader>

                  <CardContent className="px-6 pt-8 pb-6 relative z-10 flex flex-col flex-1">
                    <span
                      aria-hidden="true"
                      className="text-[clamp(48px,5vw,64px)] leading-none block mb-6 select-none"
                    >
                      {item.icon}
                    </span>
                    <h3 className="font-[var(--font-heading)] text-[clamp(22px,2.4vw,34px)] font-bold tracking-[-0.03em] leading-[1.1] text-[var(--text-primary)] mb-4">
                      {item.name}
                    </h3>
                    <Separator className="bg-[var(--border)] mb-4" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] leading-loose">
                      {TALL_DESCRIPTIONS[item.name] ?? "Deep exploration in progress"}
                    </p>
                  </CardContent>

                  <CardFooter className="rounded-none border-t border-[var(--border)] bg-transparent px-6 py-4 flex items-center gap-2.5 relative z-10 mt-auto">
                    <span
                      className={`explore-dot${item.status === "Learning" ? " explore-dot--learning" : ""} w-[6px] h-[6px] rounded-full shrink-0 ${STATUS_DOT[item.status] ?? STATUS_DOT.Interested}`}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {item.status}
                    </span>
                  </CardFooter>
                </>

              ) : isWide(i) ? (
                /* ── WIDE CARD (index 3 — Blockchain) ── */
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex-1 px-6 pt-8 pb-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums select-none leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {statusBadge(item)}
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-[clamp(32px,3.5vw,48px)] leading-none block mb-4 select-none"
                    >
                      {item.icon}
                    </span>
                    <h3 className="font-[var(--font-heading)] text-[clamp(20px,2.2vw,32px)] font-bold tracking-[-0.02em] leading-[1.15] text-[var(--text-primary)] mb-5">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {BLOCKCHAIN_TAGS.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-none font-mono text-[8px] tracking-[0.1em] border-[var(--border)] text-[var(--text-muted)] bg-transparent"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {statusFooter(item)}
                </div>

              ) : (
                /* ── STANDARD CARD ── */
                <>
                  <CardHeader className="rounded-none px-6 pt-8 pb-0 flex-row items-start justify-between gap-4 relative z-10">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums select-none leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {statusBadge(item)}
                  </CardHeader>

                  <CardContent className="px-6 pt-6 pb-6 relative z-10 flex-1">
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

                  <CardFooter className="rounded-none border-t border-[var(--border)] bg-transparent px-6 py-4 flex items-center gap-2.5 relative z-10">
                    <span
                      className={`explore-dot${item.status === "Learning" ? " explore-dot--learning" : ""} w-[6px] h-[6px] rounded-full shrink-0 ${STATUS_DOT[item.status] ?? STATUS_DOT.Interested}`}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {item.status}
                    </span>
                  </CardFooter>
                </>
              )}
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
