"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";

export default function ScrollToTop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const lenis   = useLenis();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // ── 1. Initial hidden state ──
    gsap.set(wrap, { scale: 0, opacity: 0, y: 16 });

    // ── 2. ScrollTrigger: show after Hero leaves, hide when it returns ──
    // Use the element directly (not string selector) to avoid "Element not
    // found" warnings when the effect fires before #hero is in the DOM.
    const heroEl = document.querySelector<HTMLElement>("#hero");
    let ctx: gsap.Context | null = null;

    if (heroEl) {
      ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: "bottom top",
            onEnter: () =>
              gsap.to(wrap, {
                scale: 1, opacity: 1, y: 0,
                duration: 0.5, ease: "back.out(1.7)",
              }),
            onLeaveBack: () =>
              gsap.to(wrap, {
                scale: 0, opacity: 0, y: 12,
                duration: 0.3, ease: "power2.in",
              }),
          },
        });
      });
    }

    // ── 3 & 4. Hover: icon nudge via quickTo ──
    const iconEl = iconRef.current;
    const yQ = iconEl
      ? gsap.quickTo(iconEl, "y", { duration: 0.3, ease: "power2.out" })
      : null;

    const onEnter = () => yQ?.(-3);
    const onLeave = () => yQ?.(0);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      ctx?.revert();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleClick = () => {
    const wrap = wrapRef.current;
    if (wrap) {
      gsap.timeline()
        .to(wrap, { scale: 0.85, duration: 0.12, ease: "power2.out" })
        .to(wrap, { scale: 1,    duration: 0.45, ease: "back.out(2)" });
    }
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-8 right-8 z-50"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={handleClick}
            aria-label="Scroll to top"
            data-cursor="link"
            className="flex items-center justify-center w-10 h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-0 rounded-none cursor-none transition-colors duration-200"
          >
            <svg
              ref={iconRef}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 10V2M2 6l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </TooltipTrigger>
          <TooltipContent className="rounded-none font-mono text-[10px] tracking-[0.08em] bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border)]">
            Back to top
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
