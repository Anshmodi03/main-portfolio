"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LaserFlow from "@/components/ui/LaserFlow";
import { personal } from "@/lib/data";

export default function WorkTogether() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const h2Ref       = useRef<HTMLHeadingElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Eyebrow fade-up
      gsap.fromTo(
        eyebrowRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );

      // H2 SplitText lines — big dramatic reveal
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.0, ease: "power3.out", stagger: 0.12,
            scrollTrigger: { trigger: h2Ref.current, start: "top 80%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // CTA group stagger
      gsap.fromTo(
        ctaGroupRef.current?.querySelectorAll(".cta-animate") ?? [],
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: ctaGroupRef.current, start: "top 85%" },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work-together"
      ref={sectionRef}
      className="relative min-h-[80vh] overflow-hidden bg-[var(--bg-base)] flex items-center"
    >
      {/* LaserFlow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <LaserFlow
          color="#fb460d"
          wispDensity={6}
          flowSpeed={0.6}
          flowStrength={0.45}
          fogIntensity={0.55}
          mouseTiltStrength={0.04}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-[var(--bg-base)]/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-[var(--gutter)] py-[var(--section-pad)]">

        <p
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-8"
        >
          // Next chapter
        </p>

        <h2
          ref={h2Ref}
          className="text-[clamp(56px,9vw,140px)] font-bold tracking-[-0.04em] leading-[0.95] font-[var(--font-heading)] text-[var(--text-primary)] mb-12"
        >
          Let&apos;s Work<br />Together
        </h2>

        <div
          ref={ctaGroupRef}
          className="flex flex-col items-center gap-6"
        >
          <p className="cta-animate text-[16px] text-[var(--text-muted)] leading-[1.7] max-w-md">
            Have a project in mind? I&apos;d love to help you build it.
          </p>

          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "cta-animate rounded-none bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-mono text-[11px] uppercase tracking-[0.14em] h-14 px-10 transition-colors duration-200 no-underline"
            )}
            data-cursor="link"
          >
            Start a Project →
          </a>

          <p className="cta-animate font-mono text-[11px] tracking-[0.1em] text-[var(--text-muted)] opacity-60">
            or email{" "}
            <a
              href={`mailto:${personal.email}`}
              className="underline underline-offset-2 hover:text-[var(--accent)] transition-colors duration-150"
              data-cursor="link"
            >
              {personal.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
