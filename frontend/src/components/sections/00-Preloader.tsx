"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef   = useRef<HTMLDivElement>(null);
  const nameRef      = useRef<HTMLDivElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLSpanElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      const tl  = gsap.timeline();

      // Name line-mask reveal (slides up from below overflow-hidden container)
      tl.fromTo(nameRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
        0
      );

      // Accent divider draws left → right
      tl.fromTo(dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
        0.3
      );

      // Tagline scrambles in via ScrambleText
      tl.set(taglineRef.current, { opacity: 1 }, 0.7)
        .to(taglineRef.current, {
          scrambleText: { text: "// Full Stack Developer", chars: "01!@#$%", speed: 0.6 },
          duration: 0.8,
        }, 0.7);

      // Counter counts 0 → 100%
      tl.to(obj, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current)
            counterRef.current.textContent = `${Math.round(obj.val)}%`;
        },
      }, 0);

      // Progress bar fills
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 2,
        ease: "power2.inOut",
        transformOrigin: "left",
      }, 0);

      // Content fades up just before curtain (clears the stage)
      tl.to([nameRef.current, dividerRef.current, taglineRef.current],
        { y: -16, opacity: 0, duration: 0.4, ease: "power2.in", stagger: 0.04 },
        1.85
      );

      // Curtain wipes left → right — covers entire preloader
      tl.fromTo(curtainRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: "power4.inOut", transformOrigin: "left" },
        2.0
      );

      // Callback fires after curtain fully covers (t=2.7) — safe to remove DOM
      tl.call(() => { setVisible(false); onComplete(); }, [], 2.75);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[var(--bg-base)] flex items-center justify-center"
    >
      {/* Curtain exit — wipes left to right over content, then DOM is removed */}
      <div ref={curtainRef} className="preloader__curtain" />

      {/* Center content */}
      <div className="relative z-[3] flex flex-col items-center gap-4">
        {/* Name inside overflow-hidden line-mask */}
        <div className="overflow-hidden pb-1">
          <div
            ref={nameRef}
            className="font-[var(--font-heading)] font-bold text-[var(--text-primary)] text-[clamp(48px,6vw,88px)] leading-none tracking-[-0.03em] select-none"
          >
            ANSH MODI
          </div>
        </div>

        {/* Accent divider */}
        <div
          ref={dividerRef}
          className="preloader__divider w-full h-[1px] bg-[var(--accent)] origin-left scale-x-0"
        />

        {/* Tagline — ScrambleText target */}
        <span
          ref={taglineRef}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-0"
        >
          // Full Stack Developer
        </span>
      </div>

      {/* Counter — bottom right */}
      <span
        ref={counterRef}
        className="absolute bottom-[var(--gutter)] right-[var(--gutter)] z-[3] font-mono text-[11px] tracking-[0.12em] text-[var(--text-muted)] tabular-nums"
      >
        0%
      </span>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--border)] z-[3]">
        <div
          ref={barRef}
          className="h-full bg-[var(--accent)] origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
