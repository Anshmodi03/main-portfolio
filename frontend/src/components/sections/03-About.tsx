"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { personal, stats } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import SpinButton from "@/components/ui/SpinButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const TECH_TAGS = [
  "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express.js", "MongoDB", "REST APIs",
  "TailwindCSS", "GSAP",
];

const INFO_ROWS = [
  { key: "Location", value: "Remote" },
  { key: "Since",    value: "2023" },
  { key: "Role",     value: "Full Stack Dev" },
  { key: "Stack",    value: "MERN + TS", accent: true },
];

export default function About() {
  const sectionRef    = useRef<HTMLElement>(null);
  const watermarkRef  = useRef<HTMLSpanElement>(null);
  const topLineRef    = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLSpanElement>(null);
  const h2Ref         = useRef<HTMLHeadingElement>(null);
  const quoteBarRef   = useRef<HTMLSpanElement>(null);
  const quoteRef      = useRef<HTMLParagraphElement>(null);
  const bioLongRef    = useRef<HTMLParagraphElement>(null);
  const badgesRef     = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const statsGridRef  = useRef<HTMLDivElement>(null);
  const pingRef       = useRef<HTMLSpanElement>(null);

  // Per-stat-card refs for accent lines, glow, and tilt
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const accentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Watermark parallax ─────────────────────────────────────────────
      gsap.to(watermarkRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });

      // ── 2. Top accent line draws left → right ─────────────────────────────
      gsap.fromTo(
        topLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );

      // ── 3. Eyebrow ScrambleText ───────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, {
          duration: 0.9,
          scrambleText: { text: "// About Me", chars: "01!#?$", speed: 0.7 },
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 82%", once: true },
        });
      }

      // ── 4. H2 SplitText chars reveal ─────────────────────────────────────
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

      // ── 5. Bio quote left accent bar scaleY ──────────────────────────────
      gsap.fromTo(
        quoteBarRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: quoteRef.current, start: "top 82%" },
        }
      );

      // ── 6. Quote fade-up ──────────────────────────────────────────────────
      gsap.fromTo(
        quoteRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: quoteRef.current, start: "top 82%" },
        }
      );

      // ── 6b. BioLong SplitText lines ──────────────────────────────────────
      if (bioLongRef.current) {
        const bioSplit = new SplitText(bioLongRef.current, { type: "lines" });
        gsap.fromTo(
          bioSplit.lines,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: bioLongRef.current, start: "top 82%" },
            onComplete: () => bioSplit.revert(),
          }
        );
      }

      // ── 7. Tech badge stagger ─────────────────────────────────────────────
      const badges = badgesRef.current?.querySelectorAll(".about-badge") ?? [];
      if (badges.length) {
        gsap.fromTo(
          badges,
          { y: 16, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05,
            scrollTrigger: { trigger: badgesRef.current, start: "top 85%" },
          }
        );
      }

      // ── 8. CTA group fade-up ──────────────────────────────────────────────
      const ctaItems = ctaRef.current?.querySelectorAll(".about-cta") ?? [];
      if (ctaItems.length) {
        gsap.fromTo(
          ctaItems,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
          }
        );
      }

      // ── 9. Stat card entrance stagger ─────────────────────────────────────
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 40, scale: 0.97, opacity: 0 },
          {
            y: 0, scale: 1, opacity: 1, duration: 0.65, ease: "back.out(1.4)", stagger: 0.09,
            scrollTrigger: { trigger: statsGridRef.current, start: "top 82%" },
          }
        );
      }

      // ── 9b. Per-stat card accent line scaleX stagger ─────────────────────
      const accents = accentRefs.current.filter(Boolean);
      if (accents.length) {
        gsap.fromTo(
          accents,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.55, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: statsGridRef.current, start: "top 82%" },
          }
        );
      }

      // ── 11. Availability pulse dot ────────────────────────────────────────
      if (pingRef.current) {
        gsap.to(pingRef.current, {
          scale: 2.4, opacity: 0,
          duration: 1.4, ease: "power2.out",
          repeat: -1, repeatDelay: 0.3,
        });
      }

    }, sectionRef);

    // ── 10. Per-stat card 3D tilt + magic glow ────────────────────────────
    const cleanups: (() => void)[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const glow = glowRefs.current[i];

      const rotYQ = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
      const rotXQ = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotYQ((px - 0.5) * 12);
        rotXQ(-(py - 0.5) * 12);
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
        rotYQ(0); rotXQ(0);
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
        gsap.to(card, { boxShadow: "inset 0 0 0 1px rgba(34,34,34,0)", duration: 0.5 });
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        ABOUT
      </span>

      {/* ── Zone 1: Header ── */}
      <div className="relative z-10">
        <div ref={topLineRef} className="h-px w-full bg-[var(--accent)] mb-10" />

        <div className="flex items-center justify-between mb-8">
          <span
            ref={eyebrowRef}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            // About Me
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {personal.location} — Est. 2023
          </span>
        </div>

        <Separator className="bg-[var(--border)] mb-16" />
      </div>

      {/* ── Zone 2: H2 Statement ── */}
      <div className="relative z-10 mb-16">
        <h2
          ref={h2Ref}
          className="text-[clamp(40px,6.5vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-0 font-[var(--font-heading)]"
        >
          Crafting digital<br />
          experiences that{" "}
          <span className="text-[var(--accent)]">matter.</span>
        </h2>
      </div>

      <Separator className="bg-[var(--border)] mb-16 relative z-10" />

      {/* ── Zone 3: Main Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[clamp(48px,6vw,100px)] items-start">

        {/* ── Left: Content column ── */}
        <div className="flex flex-col gap-10">

          {/* Bio quote with animated left accent bar */}
          <div className="relative pl-7">
            <span
              ref={quoteBarRef}
              aria-hidden="true"
              className="absolute left-0 top-0 w-[2px] h-full bg-[var(--accent)]"
            />
            <p
              ref={quoteRef}
              className="text-[clamp(15px,1.4vw,18px)] leading-[1.85] text-[var(--text-muted)]"
            >
              {personal.bio}
            </p>
          </div>

          {/* BioLong */}
          <p
            ref={bioLongRef}
            className="text-base leading-[1.8] text-[var(--text-muted)] sm:max-w-[560px]"
          >
            {personal.bioLong}
          </p>

          {/* Tech badge cloud */}
          <div ref={badgesRef} className="flex flex-wrap gap-2">
            {TECH_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="about-badge rounded-none border-[var(--border)] bg-transparent font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 cursor-default px-3 py-1.5"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex gap-4 flex-wrap items-center">
            <SpinButton
              className="about-cta"
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
              label="Get In Touch"
            />
            <SpinButton
              className="about-cta"
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              label="GitHub"
              variant="light"
            />
          </div>
        </div>

        {/* ── Right: Stat cards + info ── */}
        <div className="flex flex-col gap-8 lg:pt-2">

          {/* 2×2 stat card grid */}
          <div
            ref={statsGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-[var(--border)] border border-[var(--border)] [perspective:1200px]"
          >
            {stats.map((stat, i) => (
              <Card
                key={stat.label}
                ref={(el) => { cardRefs.current[i] = el as HTMLDivElement | null; }}
                className="relative rounded-none border-0 bg-[var(--bg-surface)] overflow-hidden"
              >
                {/* 2px top accent line */}
                <div
                  ref={(el) => { accentRefs.current[i] = el; }}
                  className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] z-10"
                />
                {/* Magic glow */}
                <div
                  ref={(el) => { glowRefs.current[i] = el; }}
                  className="absolute inset-0 opacity-0 pointer-events-none z-0"
                />
                <CardContent className="relative z-10 p-6 flex flex-col gap-2">
                  <div className="text-[clamp(28px,3vw,44px)] font-bold tracking-[-0.04em] leading-none text-[var(--text-primary)] font-[var(--font-heading)]">
                    <Counter
                      to={stat.value}
                      suffix={stat.suffix}
                      display={(stat as { display?: string }).display}
                      duration={2000}
                    />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] leading-[1.4]">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Availability badge */}
          <div>
            <Badge
              variant="outline"
              className="rounded-none border-[#22c55e]/40 bg-transparent font-mono text-[10px] tracking-[0.12em] text-[#22c55e] px-3 py-2 flex items-center gap-2.5 w-fit"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span
                  ref={pingRef}
                  className="absolute inset-0 rounded-full bg-[#22c55e]"
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
              </span>
              Available for Work · Remote
            </Badge>
          </div>

          <Separator className="bg-[var(--border)]" />

          {/* Info key-value rows */}
          <div className="flex flex-col gap-0">
            {INFO_ROWS.map(({ key, value, accent }) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-[var(--border)] py-4 last:border-b-0"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {key}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
