"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type ValidTag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface Props {
  text: string;
  className?: string;
  tag?: ValidTag;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  splitBy?: "chars" | "words" | "lines";
}

export default function SplitText({
  text,
  className = "",
  tag: Tag = "span",
  delay = 0,
  stagger = 0.04,
  duration = 0.9,
  once = true,
  splitBy = "chars",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const esc = (c: string) =>
      c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Split text into spans manually (no GSAP SplitText needed for basic usage)
    const chars = text.split(splitBy === "words" ? /(\s+)/ : "");
    el.innerHTML = chars
      .map((char) =>
        char === " "
          ? `<span style="display:inline-block;width:0.3em"> </span>`
          : `<span style="display:inline-block;overflow:hidden"><span style="display:inline-block;transform:translateY(110%)">${esc(char)}</span></span>`
      )
      .join("");

    const innerSpans = el.querySelectorAll<HTMLElement>("span > span");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !triggered.current)) {
          triggered.current = true;
          gsap.to(innerSpans, {
            y: "0%",
            duration,
            ease: "power3.out",
            stagger,
            delay,
          });
        } else if (!entry.isIntersecting && !once) {
          triggered.current = false;
          gsap.set(innerSpans, { y: "110%" });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay, stagger, duration, once, splitBy]);

  const TagEl = Tag as "span";
  return (
    <TagEl ref={ref as React.RefObject<HTMLSpanElement>} className={className} aria-label={text}>
      {text}
    </TagEl>
  );
}
