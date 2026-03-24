"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { personal, stats } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import SpinButton from "@/components/ui/SpinButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const topLineRef   = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const quoteRef     = useRef<HTMLParagraphElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const pingRef      = useRef<HTMLSpanElement>(null);
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Top accent line draws left → right ──────────────────────────────
      gsap.fromTo(
        topLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );

      // ── 2. Watermark parallax upward ───────────────────────────────────────
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

      // ── 3. ScrambleText eyebrow ────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, {
          duration: 0.9,
          scrambleText: { text: "// About Me", chars: "01!#?$", speed: 0.7 },
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 80%", once: true },
        });
      }

      // ── 4. H2 chars reveal with CustomEase "dramatic" ─────────────────────
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

      // ── 5. Quote fade-up ───────────────────────────────────────────────────
      gsap.fromTo(
        quoteRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: quoteRef.current, start: "top 82%" },
        }
      );

      // ── 6. Stat border lines draw in per card ─────────────────────────────
      borderRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.9, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 7. Stat items stagger fade-up ─────────────────────────────────────
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".about-stat-item") ?? [],
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );

      // ── 8. Stats column parallax (drifts slower than content) ─────────────
      gsap.to(statsRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      // ── 9. Availability pulse dot ──────────────────────────────────────────
      if (pingRef.current) {
        gsap.to(pingRef.current, {
          scale: 2.4,
          opacity: 0,
          duration: 1.4,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 0.3,
        });
      }

      // ── 11. Content elements fade-up ──────────────────────────────────────
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".about-animate") ?? [],
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: contentRef.current, start: "top 78%" },
        }
      );

      // ── 12. Card hover lift ────────────────────────────────────────────────
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" })
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { y: 0, duration: 0.4, ease: "power3.out" })
        );
      });

    }, sectionRef);

    return () => ctx.revert();
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

      {/* ── Zone 2: Hero Statement ── */}
      <div className="relative z-10 mb-10">
        <h2
          ref={h2Ref}
          className="text-[clamp(40px,6.5vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-8 font-[var(--font-heading)]"
        >
          Crafting digital<br />
          experiences that{" "}
          <span className="text-[var(--accent)]">matter.</span>
        </h2>

        <p
          ref={quoteRef}
          className="relative max-w-[640px] text-[clamp(15px,1.4vw,18px)] leading-[1.85] text-[var(--text-muted)] pl-7"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[-4px] text-[3rem] leading-none font-[var(--font-heading)] font-bold text-[var(--accent)] select-none"
          >
            ❝
          </span>
          {personal.bio}
        </p>
      </div>

<Separator className="bg-[var(--border)] mb-16 relative z-10" />

      {/* ── Zone 3: Main Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-[clamp(48px,6vw,120px)] items-start">

        {/* ── Stats column ── */}
        <div ref={statsRef} className="flex flex-col gap-4">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              ref={(el) => { cardRefs.current[i] = el as HTMLDivElement | null; }}
              className="about-stat-item rounded-none border-[var(--border)] bg-[var(--bg-surface)] cursor-default"
            >
              <CardContent className="p-6">
                {/* Animated top border line */}
                <div className="relative h-px bg-[var(--border)] mb-5 overflow-hidden">
                  <div
                    ref={(el) => { borderRefs.current[i] = el; }}
                    className="absolute inset-0 bg-[var(--accent)] scale-x-0 origin-left"
                  />
                </div>

                <div className="text-[clamp(48px,5.5vw,80px)] font-bold tracking-[-0.05em] leading-none text-[var(--text-primary)] font-[var(--font-heading)]">
                  <Counter
                    to={stat.value}
                    suffix={stat.suffix}
                    display={(stat as { display?: string }).display}
                    duration={2000}
                  />
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mt-3">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Availability badge */}
          <div className="pt-2">
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
        </div>

        {/* ── Content column ── */}
        <div ref={contentRef}>

          <p className="about-animate text-base leading-[1.8] text-[var(--text-muted)] max-w-[560px] mb-5">
            {personal.bioLong}
          </p>

          <p className="about-animate text-base leading-[1.8] text-[var(--text-muted)] max-w-[560px] mb-10">
            Currently exploring Machine Learning, AI integration, and cutting-edge
            animation — always pushing the boundaries of what&apos;s possible on the web.
          </p>

          {/* Tech badges */}
          <div className="about-animate flex flex-wrap gap-2 mb-12">
            {["MERN Stack", "TypeScript", "Next.js", "GSAP", "MongoDB", "REST APIs", "TailwindCSS"].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-none border-[var(--border)] bg-transparent font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 cursor-default px-3 py-1.5"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTAs */}
          <div className="about-animate flex gap-4 flex-wrap items-center">
            <SpinButton
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
              label="Get In Touch"
            />
            <SpinButton
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              label="GitHub"
              variant="light"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
