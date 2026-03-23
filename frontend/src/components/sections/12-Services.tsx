"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { services } from "@/lib/data";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  const cardRefs  = useRef<(HTMLDivElement  | null)[]>([]);
  const numRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const lineRefs  = useRef<(HTMLDivElement  | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Section header ──────────────────────────────────────────────────────

      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      gsap.fromTo(
        headerRef.current?.querySelectorAll(".svc-header-animate") ?? [],
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        }
      );

      // ── Cards stagger fade-up ───────────────────────────────────────────────

      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        }
      );

      // ── Per-card animations ─────────────────────────────────────────────────

      services.forEach((svc, i) => {
        const card  = cardRefs.current[i];
        const numEl = numRefs.current[i];
        const titleEl = titleRefs.current[i];
        const lineEl  = lineRefs.current[i];
        if (!card) return;

        // 1. ScrambleText on number
        if (numEl) {
          gsap.to(numEl, {
            duration: 0.7,
            scrambleText: { text: svc.number, chars: "0123456789", speed: 0.5 },
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
          });
        }

        // 2. SplitText chars on title
        if (titleEl) {
          const split = new SplitText(titleEl, { type: "chars" });
          gsap.fromTo(
            split.chars,
            { y: 32, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.016,
              scrollTrigger: { trigger: card, start: "top 78%", once: true },
              onComplete: () => split.revert(),
            }
          );
        }

        // 3. Hover — accent line draws in / out
        if (lineEl) {
          card.addEventListener("mouseenter", () =>
            gsap.to(lineEl, { scaleY: 1, duration: 0.55, ease: "power3.out" })
          );
          card.addEventListener("mouseleave", () =>
            gsap.to(lineEl, { scaleY: 0, duration: 0.4, ease: "power3.in" })
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-[var(--bg-base)]"
    >
      {/* ── Section header ── */}
      <div ref={headerRef} className="px-[var(--gutter)] pt-[var(--section-pad)] pb-12">
        <p className="svc-header-animate font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6">
          // What I Build
        </p>
        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mt-4 font-[var(--font-heading)]"
        >
          Services
        </h2>
        <p className="svc-header-animate font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mt-3">
          01 — {String(services.length).padStart(2, "0")}
        </p>
      </div>

      {/* ── Cards grid ── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] border-t border-[var(--border)]"
      >
        {services.map((svc, i) => (
          <div
            key={svc.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="relative bg-[var(--bg-surface)] p-10 flex flex-col gap-0 cursor-default"
          >
            {/* Left accent line */}
            <div className="absolute left-0 inset-y-0 w-px bg-[var(--border)]">
              <div
                ref={(el) => { lineRefs.current[i] = el; }}
                className="w-full h-full bg-[var(--accent)] scale-y-0 origin-top"
              />
            </div>

            {/* Number */}
            <span
              ref={(el) => { numRefs.current[i] = el; }}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
            >
              {svc.number}
            </span>

            {/* Title */}
            <h3
              ref={(el) => { titleRefs.current[i] = el; }}
              className="text-[clamp(22px,2.5vw,32px)] font-bold tracking-[-0.03em] leading-[1.15] mb-5 font-[var(--font-heading)]"
            >
              {svc.title}
            </h3>

            {/* Description */}
            <p className="text-[15px] leading-[1.75] text-[var(--text-muted)] mb-8 flex-1">
              {svc.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {svc.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-none font-mono text-[10px] tracking-[0.1em] border-[var(--border)] text-[var(--text-muted)] bg-transparent"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
