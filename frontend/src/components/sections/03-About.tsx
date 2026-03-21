"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/Counter";

const EDITORIAL_STATS = [
  { value: 40,    suffix: "+", label: "Projects Completed" },
  { value: 1,     suffix: "+", label: "Years Experience" },
  { value: 10000, suffix: "+", label: "Lines of Code", display: "10K+" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats stagger fade-up
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".about-stat-item") ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" } }
      );

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

      // Content paragraphs + CTA
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".about-animate") ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: contentRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-16 block">
        // About Me
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-[clamp(48px,6vw,120px)] items-start">
        {/* Stats column */}
        <div ref={statsRef} className="flex flex-col gap-14">
          {EDITORIAL_STATS.map((stat) => (
            <div key={stat.label} className="about-stat-item border-t border-[var(--border)] pt-6">
              <div className="text-[clamp(56px,7vw,96px)] font-bold tracking-[-0.05em] leading-none text-[var(--text-primary)] font-[var(--font-heading)]">
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  display={stat.display}
                  duration={2000}
                />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Content column */}
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

          <p className="about-animate text-base leading-[1.75] text-[var(--text-muted)] max-w-[560px] mb-8">
            Currently exploring Machine Learning, AI integration, and WebGL — always
            pushing the boundaries of what&apos;s possible on the web.
          </p>

          <div className="about-animate mb-10">
            <Badge
              variant="outline"
              className="rounded-none font-mono text-[10px] tracking-[0.12em] border-[#22c55e] text-[#22c55e] bg-transparent"
            >
              ● Available for Work
            </Badge>
          </div>

          <div className="about-animate flex gap-4 flex-wrap">
            <Button
              variant="outline"
              className="rounded-none border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8 transition-colors duration-200"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              data-cursor="link"
            >
              Get In Touch
            </Button>
            <a
              href="https://github.com/Anshmodi03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-none text-[var(--text-muted)] hover:text-[var(--text-primary)] font-mono text-[11px] uppercase tracking-[0.14em] h-12 px-8 no-underline transition-colors"
              data-cursor="link"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
