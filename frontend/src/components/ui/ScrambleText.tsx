"use client";

import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface Props {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  trigger?: boolean; // external trigger
}

export default function ScrambleText({
  text,
  className = "",
  duration = 1200,
  delay = 0,
  trigger,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const animRef = useRef<number | null>(null);
  const started = useRef(false);

  const scramble = () => {
    const el = ref.current;
    if (!el) return;
    const startTime = performance.now() + delay;
    let raf: number;

    const step = (now: number) => {
      if (now < startTime) {
        raf = requestAnimationFrame(step);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * text.length);

      el.textContent =
        text.slice(0, revealCount) +
        text
          .slice(revealCount)
          .split("")
          .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
          .join("");

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
      animRef.current = raf;
    };

    raf = requestAnimationFrame(step);
    animRef.current = raf;
  };

  // IntersectionObserver trigger (default behavior)
  useEffect(() => {
    const el = ref.current;
    if (!el || trigger !== undefined) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          scramble();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [text, duration, delay]);

  // External trigger
  useEffect(() => {
    if (trigger !== undefined && trigger) {
      scramble();
    }
  }, [trigger]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
