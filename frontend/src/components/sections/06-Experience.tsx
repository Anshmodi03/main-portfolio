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

  // Per-entry refs
  const lineRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const svgLineRefs = useRef<(SVGPathElement | null)[]>([]);
  const indexRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const companyRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const pingRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  // Flat array: entries × 2 metrics (i*2+mi indexing)
  const metricRefs  = useRef<(HTMLSpanElement | null)[]>([]);

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

      // ── Per-entry animations ────────────────────────────────────────────────
      experiences.forEach((exp, i) => {
        const entryEl = sectionRef.current?.querySelector(`[data-exp-id="${exp.id}"]`);
        if (!entryEl) return;

        // 4. Top accent line scaleX 0→1
        const lineEl = lineRefs.current[i];
        if (lineEl) {
          gsap.fromTo(
            lineEl,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1, duration: 1.0, ease: "power3.out",
              scrollTrigger: { trigger: entryEl, start: "top 82%", once: true },
            }
          );
        }

        // 5. DrawSVG vertical line
        const svgLine = svgLineRefs.current[i];
        if (svgLine) {
          gsap.from(svgLine, {
            drawSVG: "0%",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: entryEl, start: "top 78%", once: true },
          });
        }

        // 6. Index ScrambleText
        const indexEl = indexRefs.current[i];
        if (indexEl) {
          gsap.to(indexEl, {
            duration: 0.6,
            scrambleText: {
              text: String(i + 1).padStart(2, "0"),
              chars: "0123456789",
              speed: 0.5,
            },
            scrollTrigger: { trigger: entryEl, start: "top 80%", once: true },
          });
        }

        // 7. Company name SplitText chars
        const companyEl = companyRefs.current[i];
        if (companyEl) {
          const companySplit = new SplitText(companyEl, { type: "chars,words" });
          gsap.fromTo(
            companySplit.chars,
            { y: 64, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, ease: "dramatic", stagger: 0.015,
              scrollTrigger: { trigger: entryEl, start: "top 80%", once: true },
              onComplete: () => companySplit.revert(),
            }
          );
        }

        // 8. Content stagger (role eyebrow, duration/location, description)
        const animateEls = Array.from(entryEl.querySelectorAll(".exp-animate"));
        if (animateEls.length) {
          gsap.fromTo(
            animateEls,
            { y: 28, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.07,
              scrollTrigger: { trigger: entryEl, start: "top 78%", once: true },
            }
          );
        }

        // 9. Achievement items stagger from left
        const achievements = Array.from(entryEl.querySelectorAll(".exp-achievement"));
        if (achievements.length) {
          gsap.fromTo(
            achievements,
            { x: -24, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06,
              scrollTrigger: { trigger: achievements[0], start: "top 82%", once: true },
            }
          );
        }

        // 10. Metric counters
        if (exp.metrics) {
          exp.metrics.forEach((m, mi) => {
            const metricEl = metricRefs.current[i * 2 + mi];
            if (!metricEl) return;
            // Parse numeric value and suffix (e.g. "30%" → 30, "%")
            const match = m.value.match(/^(\d+(?:\.\d+)?)(.*)$/);
            if (!match) return;
            const target  = parseFloat(match[1]);
            const suffix  = match[2] ?? "";
            const obj     = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: { trigger: entryEl, start: "top 72%", once: true },
              onUpdate: () => {
                if (metricEl) metricEl.textContent = Math.round(obj.val) + suffix;
              },
            });
          });
        }

        // 11. Tech badge row stagger
        const badges = Array.from(entryEl.querySelectorAll(".exp-badge"));
        if (badges.length) {
          gsap.fromTo(
            badges,
            { y: 12, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.04,
              scrollTrigger: { trigger: badges[0] as Element, start: "top 88%", once: true },
            }
          );
        }

        // 12. Status pulse dot (for "Current" entries)
        const pingEl = pingRefs.current[i];
        if (pingEl && exp.status === "Current") {
          gsap.to(pingEl, {
            scale: 2.4,
            opacity: 0,
            duration: 1.4,
            ease: "power2.out",
            repeat: -1,
            repeatDelay: 0.3,
          });
        }
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

        {/* ── Entries ── */}
        <div>
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              data-exp-id={exp.id}
              className="relative border-b border-[var(--border)] pb-[clamp(48px,7vh,96px)] mb-[clamp(48px,7vh,96px)] last:border-b-0 last:mb-0"
            >
              {/* Top accent line draws in */}
              <div className="relative h-px bg-[var(--border)] overflow-hidden mb-10 md:mb-14">
                <div
                  ref={(el) => { lineRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[var(--accent)] origin-left"
                />
              </div>

              <div className="grid grid-cols-[clamp(40px,5vw,72px)_1fr] gap-6 md:gap-12">
                {/* ── Left: index + DrawSVG vertical line ── */}
                <div className="relative flex flex-col items-center gap-3 pt-1">
                  <span
                    ref={(el) => { indexRefs.current[i] = el; }}
                    className="font-mono text-[clamp(13px,1.1vw,17px)] text-[var(--text-muted)] tabular-nums select-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* DrawSVG vertical decorative line */}
                  <div className="flex-1 w-px relative overflow-hidden">
                    <svg
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <path
                        ref={(el) => { svgLineRefs.current[i] = el; }}
                        d="M 1 0 L 1 2000"
                        stroke="var(--border)"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>

                {/* ── Right: content ── */}
                <div>
                  {/* Company + status + type row */}
                  <div className="flex flex-wrap items-baseline gap-3 mb-4">
                    <h3
                      ref={(el) => { companyRefs.current[i] = el; }}
                      className="font-[var(--font-heading)] text-[clamp(28px,4vw,56px)] font-bold tracking-[-0.03em] leading-[1.05] text-[var(--text-primary)]"
                    >
                      {exp.company}
                    </h3>

                    {exp.status === "Current" && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                        <span
                          ref={(el) => { pingRefs.current[i] = el; }}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"
                        />
                        Active
                      </span>
                    )}

                    <Badge
                      variant="outline"
                      className="rounded-none font-mono text-[10px] tracking-[0.10em] border-[var(--border)] text-[var(--text-muted)] bg-transparent"
                    >
                      {exp.type}
                    </Badge>
                  </div>

                  {/* Role eyebrow */}
                  <p className="exp-animate font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-4">
                    {exp.role}
                  </p>

                  {/* Duration · location */}
                  <div className="exp-animate flex flex-wrap items-center gap-3 mb-7">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-[0.12em]">
                      {exp.duration}
                    </span>
                    <span className="text-[var(--border)] text-[10px]">◆</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-[0.12em]">
                      {exp.location}
                    </span>
                    <span className="text-[var(--border)] text-[10px]">◆</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-[0.12em]">
                      {exp.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="exp-animate text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-2xl mb-7">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <ul className="mb-8 flex flex-col gap-2.5">
                    {exp.achievements.map((a) => (
                      <li
                        key={a}
                        className="exp-achievement flex gap-3 text-[13px] text-[var(--text-muted)] leading-relaxed"
                      >
                        <span className="text-[var(--accent)] mt-[2px] shrink-0 select-none">↳</span>
                        {a}
                      </li>
                    ))}
                  </ul>

                  {/* Metrics */}
                  {exp.metrics && exp.metrics.length > 0 && (
                    <div className="exp-animate flex flex-wrap gap-4 mb-8">
                      {exp.metrics.map((m, mi) => (
                        <div
                          key={m.label}
                          className="border border-[var(--border)] px-5 py-4 flex flex-col gap-1.5 w-[calc(50%-8px)] sm:w-auto sm:min-w-[130px]"
                        >
                          <span
                            ref={(el) => { metricRefs.current[i * 2 + mi] = el; }}
                            className="font-[var(--font-heading)] text-[clamp(24px,2.5vw,36px)] font-bold tabular-nums text-[var(--text-primary)] leading-none"
                          >
                            0
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] leading-tight">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="exp-badge rounded-none font-mono text-[10px] tracking-[0.08em] border-[var(--border)] text-[var(--text-muted)] bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 cursor-default"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>

                  {/* Certificate link */}
                  {exp.certificate && (
                    <a
                      href={exp.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 no-underline group"
                      data-cursor="link"
                    >
                      <span className="w-8 h-px bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors duration-200" />
                      View Certificate
                      <span className="group-hover:translate-x-1 transition-transform duration-200">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── LinkedIn CTA ── */}
        <div className="mt-[clamp(32px,4vh,64px)]">
          <a
            href="https://www.linkedin.com/in/anshmodi03/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 no-underline group"
            data-cursor="link"
          >
            <span className="w-8 h-px bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors duration-200" />
            View LinkedIn Profile
            <span className="group-hover:translate-x-1 transition-transform duration-200">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
