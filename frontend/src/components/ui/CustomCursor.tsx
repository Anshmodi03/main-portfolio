"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Centre both elements, park off-screen initially
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    // quickTo trackers — dot near-instant, ring has trailing lag
    const dotX  = gsap.quickTo(dot,  "x", { duration: 0.04, ease: "none" });
    const dotY  = gsap.quickTo(dot,  "y", { duration: 0.04, ease: "none" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);  dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.1, ease: "power2.in" });
      gsap.timeline()
        .to(ring, { scale: 0.78, duration: 0.12, ease: "power2.in" })
        .to(ring, { scale: 1,    duration: 0.5,  ease: "elastic.out(1.2, 0.5)" });
    };

    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: "back.out(2)" });
    };

    const onEnter = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-cursor]")) return;
      gsap.to(dot,  { scale: 0, duration: 0.2, ease: "power2.out" });
      gsap.to(ring, {
        width: 72, height: 72,
        borderColor: "rgba(251,70,13,0.9)",
        backgroundColor: "rgba(251,70,13,0.07)",
        duration: 0.35, ease: "power3.out",
      });
    };

    const onLeave = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-cursor]")) return;
      gsap.to(dot,  { scale: 1, duration: 0.3, ease: "back.out(1.5)" });
      gsap.to(ring, {
        width: 52, height: 52,
        borderColor: "rgba(245,245,245,0.22)",
        backgroundColor: "transparent",
        duration: 0.35, ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup",   onMouseUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout",  onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup",   onMouseUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout",  onLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
