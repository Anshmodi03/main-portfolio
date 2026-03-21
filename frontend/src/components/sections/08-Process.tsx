"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { processSteps } from "@/lib/data";

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const stepsRef   = useRef<HTMLDivElement>(null);

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

      // Step rows stagger
      gsap.fromTo(
        stepsRef.current?.querySelectorAll(".process-step") ?? [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block">
        // Process
      </p>

      <h2
        ref={h2Ref}
        className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(64px,8vh,120px)] font-[var(--font-heading)]"
      >
        How I Work
      </h2>

      <div ref={stepsRef} className="flex flex-col">
        {processSteps.map((step) => (
          <div
            key={step.number}
            className="process-step relative grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-[clamp(40px,6vh,80px)] border-t border-[var(--border)]"
          >
            {/* Ghost background number */}
            <span
              className="absolute -top-5 -left-4 font-[var(--font-heading)] text-[clamp(120px,18vw,220px)] font-bold tracking-[-0.05em] leading-[0.8] text-[var(--text-primary)] opacity-[0.04] pointer-events-none select-none"
              aria-hidden="true"
            >
              {step.number}
            </span>

            {/* Left: label + title */}
            <div className="relative z-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
                {step.number} — {step.title.toUpperCase()}
              </p>
              <h3 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.03em] leading-[1.1] font-[var(--font-heading)]">
                {step.title}
              </h3>
            </div>

            {/* Right: description */}
            <p className="text-[15px] leading-[1.7] text-[var(--text-muted)] relative z-10">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
