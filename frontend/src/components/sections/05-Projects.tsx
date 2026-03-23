"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SpinButton from "@/components/ui/SpinButton";
import { projects, otherProjects } from "@/lib/data";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const otherRef   = useRef<HTMLDivElement>(null);

  // Per-card refs
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const h3Refs      = useRef<(HTMLHeadingElement | null)[]>([]);
  const numRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        headerRef.current?.querySelectorAll(".projects-animate") ?? [],
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        }
      );

      // ── Per-card animations ─────────────────────────────────────────────────

      projects.forEach((project, i) => {
        const card    = cardRefs.current[i];
        const h3El    = h3Refs.current[i];
        const numEl   = numRefs.current[i];
        const lineEl  = lineRefs.current[i];
        const imgEl   = imgRefs.current[i];
        const content = contentRefs.current[i];
        if (!card) return;

        // 1. Project number ScrambleText
        if (numEl) {
          gsap.to(numEl, {
            duration: 0.6,
            scrambleText: {
              text: String(i + 1).padStart(2, "0"),
              chars: "0123456789",
              speed: 0.5,
            },
            scrollTrigger: { trigger: card, start: "top 72%", once: true },
          });
        }

        // 2. Accent left line draws down (scaleY 0 → 1)
        if (lineEl) {
          gsap.fromTo(
            lineEl,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 72%", once: true },
            }
          );
        }

        // 3. H3 SplitText chars reveal
        if (h3El) {
          const split = new SplitText(h3El, { type: "chars" });
          gsap.fromTo(
            split.chars,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.018,
              scrollTrigger: { trigger: card, start: "top 70%", once: true },
              onComplete: () => split.revert(),
            }
          );
        }

        // 4. Description / badges / CTAs stagger fade-up
        if (content) {
          gsap.fromTo(
            content.querySelectorAll(".card-animate"),
            { y: 22, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
              scrollTrigger: { trigger: card, start: "top 65%", once: true },
            }
          );
        }

        // 5. Image parallax (subtle depth — no scale, just y)
        if (imgEl) {
          gsap.to(imgEl, {
            y: -36,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        // 6. Image hover zoom
        const wrap = card.querySelector(".project-image-wrap");
        if (wrap && imgEl) {
          wrap.addEventListener("mouseenter", () =>
            gsap.to(imgEl, { scale: 1.08, duration: 0.7, ease: "power2.out" })
          );
          wrap.addEventListener("mouseleave", () =>
            gsap.to(imgEl, { scale: 1.0, duration: 0.6, ease: "power2.out" })
          );
        }
      });

      // ── Other project cards stagger ──────────────────────────────────────────

      gsap.fromTo(
        otherRef.current?.querySelectorAll(".other-card-item") ?? [],
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: otherRef.current, start: "top 80%" },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative bg-[var(--bg-base)]">

      {/* ── Section header ── */}
      <div ref={headerRef} className="px-[var(--gutter)] pt-[var(--section-pad)] pb-12">
        <p className="projects-animate font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6">
          // Work
        </p>
        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mt-4 font-[var(--font-heading)]"
        >
          Featured Projects
        </h2>
        <p className="projects-animate font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mt-3">
          01 — {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      {/* ── Sticky scroll cards ── */}
      <div className="relative">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="min-h-[100dvh] flex items-center justify-center sticky top-0 py-8 px-4 md:px-[var(--gutter)]"
          >
            {/* Left accent line */}
            <div className="absolute left-0 inset-y-0 w-px bg-[var(--border)]">
              <div
                ref={(el) => { lineRefs.current[i] = el; }}
                className="w-full h-full bg-[var(--accent)] scale-y-0 origin-top"
              />
            </div>

            <Card className="rounded-none border-[var(--border)] bg-[var(--bg-surface)] w-full max-w-5xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* Image panel */}
                <div className="project-image-wrap relative aspect-[4/3] overflow-hidden bg-[var(--bg-raised)]">
                  <span
                    ref={(el) => { numRefs.current[i] = el; }}
                    className="absolute top-4 left-4 z-10 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      ref={(el) => {
                        if (el) imgRefs.current[i] = el as unknown as HTMLImageElement;
                      }}
                    />
                  )}
                </div>

                {/* Content panel */}
                <CardContent
                  ref={(el) => { contentRefs.current[i] = el as HTMLDivElement | null; }}
                  className="p-8 md:p-12 flex flex-col justify-between"
                >
                  <div>
                    <p className="card-animate font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">
                      {project.year}
                    </p>
                    <h3
                      ref={(el) => { h3Refs.current[i] = el; }}
                      className="text-[clamp(24px,3vw,40px)] font-bold tracking-[-0.03em] leading-[1.1] mb-4 font-[var(--font-heading)]"
                    >
                      {project.name}
                    </h3>
                    <p className="card-animate text-[15px] leading-[1.7] text-[var(--text-muted)] mb-6">
                      {project.description}
                    </p>
                    <div className="card-animate flex flex-wrap gap-2 mb-8">
                      {project.tech.map((t) => (
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
                  <div className="card-animate flex gap-3 flex-wrap">
                    {project.github && (
                      <SpinButton
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        label="GitHub"
                        variant="light"
                      />
                    )}
                    {project.live && (
                      <SpinButton
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        label="Live"
                        variant="accent"
                      />
                    )}
                  </div>
                </CardContent>

              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* ── Other Projects ── */}
      <div ref={otherRef} className="px-[var(--gutter)] py-[var(--section-pad)]">
        <h3 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.03em] mb-12 font-[var(--font-heading)]">
          Other Projects
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
          {otherProjects.map((p) => (
            <a
              key={p.id}
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="other-card-item group bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] p-8 flex flex-col gap-4 transition-colors duration-200 no-underline"
              data-cursor="link"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--accent)]">
                {p.tags[0]}
              </p>
              <h4 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 font-[var(--font-heading)]">
                {p.name}
              </h4>
              <p className="text-[14px] leading-[1.6] text-[var(--text-muted)] flex-1">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {p.tech.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="rounded-none font-mono text-[10px] tracking-[0.1em] border-[var(--border)] text-[var(--text-muted)] bg-transparent"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <SpinButton
            href="https://github.com/Anshmodi03"
            target="_blank"
            rel="noopener noreferrer"
            label="Explore All on GitHub"
          />
        </div>
      </div>

    </section>
  );
}
