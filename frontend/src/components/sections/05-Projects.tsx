"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projects, otherProjects } from "@/lib/data";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const otherRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // H2 SplitText line reveal
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert() }
        );
      }

      // Header meta lines fade-up
      gsap.fromTo(
        headerRef.current?.querySelectorAll(".projects-animate") ?? [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" } }
      );

      // Other project cards stagger
      gsap.fromTo(
        otherRef.current?.querySelectorAll(".other-card-item") ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: otherRef.current, start: "top 80%" } }
      );

      // GSAP image hover zoom — image scales, card border stays fixed
      const wraps = sectionRef.current?.querySelectorAll(".project-image-wrap");
      wraps?.forEach((wrap) => {
        const img = wrap.querySelector("img");
        if (!img) return;
        wrap.addEventListener("mouseenter", () =>
          gsap.to(img, { scale: 1.1, duration: 0.7, ease: "power2.out" })
        );
        wrap.addEventListener("mouseleave", () =>
          gsap.to(img, { scale: 1.0, duration: 0.6, ease: "power2.out" })
        );
      });
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
            className="min-h-[100dvh] flex items-center justify-center sticky top-0 py-8 px-4 md:px-[var(--gutter)]"
          >
            <Card className="rounded-none border-[var(--border)] bg-[var(--bg-surface)] w-full max-w-5xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* Image panel */}
                <div className="project-image-wrap relative aspect-[4/3] overflow-hidden bg-[var(--bg-raised)]">
                  <span className="absolute top-4 left-4 z-10 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>

                {/* Content panel */}
                <CardContent className="p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">
                      {project.year}
                    </p>
                    <h3 className="text-[clamp(24px,3vw,40px)] font-bold tracking-[-0.03em] leading-[1.1] mb-4 font-[var(--font-heading)]">
                      {project.name}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[var(--text-muted)] mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
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
                  <div className="flex gap-3 flex-wrap">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-none border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-[0.12em] no-underline")}
                        data-cursor="link"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ size: "sm" }), "rounded-none bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-mono text-[10px] uppercase tracking-[0.12em] no-underline")}
                        data-cursor="link"
                      >
                        Live ↗
                      </a>
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
          <a
            href="https://github.com/Anshmodi03"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-none border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8 transition-colors duration-200 no-underline")}
            data-cursor="link"
          >
            Explore All on GitHub →
          </a>
        </div>
      </div>

    </section>
  );
}
