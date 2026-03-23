"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Counter from "@/components/ui/Counter";
import SpinButton from "@/components/ui/SpinButton";

const EDITORIAL_STATS = [
  { value: 40,    suffix: "+", label: "Projects Completed" },
  { value: 1,     suffix: "+", label: "Years Experience" },
  { value: 10000, suffix: "+", label: "Lines of Code", display: "10K+" },
];

const TECH_TAGS = ["MERN Stack", "TypeScript", "Next.js", "GSAP", "MongoDB"];

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const h2Ref       = useRef<HTMLHeadingElement>(null);
  const topLineRef  = useRef<HTMLDivElement>(null);
  const pingRef     = useRef<HTMLSpanElement>(null);

  // Per-stat border line refs
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Top accent line draws across ──────────────────────────────────────
      gsap.fromTo(
        topLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        }
      );

      // ── Stat border lines draw in per item ───────────────────────────────
      borderRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            delay: i * 0.1,
          }
        );
      });

      // ── Stats stagger fade-up ─────────────────────────────────────────────
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".about-stat-item") ?? [],
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.18,
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );

      // ── Parallax — stats column drifts up slower ──────────────────────────
      gsap.to(statsRef.current, {
        y: -55,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      // ── H2 word-by-word reveal ────────────────────────────────────────────
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines,words" });
        gsap.fromTo(
          split.words,
          { y: 64, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.045,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // ── Content elements fade-up ──────────────────────────────────────────
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".about-animate") ?? [],
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: contentRef.current, start: "top 78%" },
        }
      );

      // ── Availability pulse dot (GSAP, not Tailwind animate-ping) ─────────
      if (pingRef.current) {
        gsap.to(pingRef.current, {
          scale: 2.2,
          opacity: 0,
          duration: 1.4,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 0.2,
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* Top accent line — draws left → right on scroll */}
      <div ref={topLineRef} className="h-px w-full bg-[var(--accent)] mb-14" />

      {/* Eyebrow row */}
      <div className="flex items-center justify-between mb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
          // About Me
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          India — Est. 2023
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-[clamp(48px,6vw,120px)] items-start">

        {/* ── Stats column (parallax target) ── */}
        <div ref={statsRef} className="flex flex-col gap-0">
          {EDITORIAL_STATS.map((stat, i) => (
            <div key={stat.label} className="about-stat-item pb-10">
              {/* Animated border line */}
              <div className="relative h-px bg-[var(--border)] mb-7 overflow-hidden">
                <div
                  ref={(el) => { borderRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[var(--accent)] scale-x-0 origin-left"
                />
              </div>

              {/* Number */}
              <div className="text-[clamp(56px,7vw,96px)] font-bold tracking-[-0.05em] leading-none text-[var(--text-primary)] font-[var(--font-heading)]">
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  display={stat.display}
                  duration={2000}
                />
              </div>

              {/* Label */}
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-3">
                {stat.label}
              </p>
            </div>
          ))}

          {/* Availability indicator */}
          <div className="pt-6 border-t border-[var(--border)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#22c55e] flex items-center gap-2.5">
              {/* Pulsing dot — GSAP animated */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span
                  ref={pingRef}
                  className="absolute inset-0 rounded-full bg-[#22c55e]"
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
              </span>
              Available for Work · Remote
            </p>
          </div>
        </div>

        {/* ── Content column ── */}
        <div ref={contentRef}>
          <h2
            ref={h2Ref}
            className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-10 font-[var(--font-heading)]"
          >
            Turning ideas into
            <span className="text-[var(--accent)] block">digital reality.</span>
          </h2>

          <p className="about-animate text-base leading-[1.75] text-[var(--text-muted)] max-w-[560px] mb-5">
            I&apos;m a passionate Full Stack Developer based in India, specializing in
            building exceptional digital experiences using the MERN stack. I love crafting
            performant, scalable, and beautifully designed web applications.
          </p>

          <p className="about-animate text-base leading-[1.75] text-[var(--text-muted)] max-w-[560px] mb-10">
            Currently exploring Machine Learning, AI integration, and WebGL — always
            pushing the boundaries of what&apos;s possible on the web.
          </p>

          {/* Tech tags */}
          <div className="about-animate flex flex-wrap gap-2 mb-10">
            {TECH_TAGS.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] uppercase tracking-[0.12em] border border-[var(--border)] text-[var(--text-muted)] px-3 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                {t}
              </span>
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
              href="https://github.com/Anshmodi03"
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
