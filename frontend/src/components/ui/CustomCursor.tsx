"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const pointRef = useRef<HTMLDivElement>(null);
  const hRef     = useRef<HTMLDivElement>(null);
  const vRef     = useRef<HTMLDivElement>(null);
  const isTouch  = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;
    const point = pointRef.current;
    const h     = hRef.current;
    const v     = vRef.current;
    if (!point || !h || !v) return;

    // Centre all elements, park off-screen initially
    gsap.set([point, h, v], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    // Point is near-instant; arms have a short lag for visual separation
    const ptX = gsap.quickTo(point, "x", { duration: 0.04, ease: "none" });
    const ptY = gsap.quickTo(point, "y", { duration: 0.04, ease: "none" });
    const hX  = gsap.quickTo(h, "x", { duration: 0.10, ease: "power2.out" });
    const hY  = gsap.quickTo(h, "y", { duration: 0.10, ease: "power2.out" });
    const vX  = gsap.quickTo(v, "x", { duration: 0.10, ease: "power2.out" });
    const vY  = gsap.quickTo(v, "y", { duration: 0.10, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      ptX(e.clientX); ptY(e.clientY);
      hX(e.clientX);  hY(e.clientY);
      vX(e.clientX);  vY(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(point,  { scale: 0.4,  duration: 0.08, ease: "power2.in" });
      gsap.to([h, v], { scale: 0.55, duration: 0.08, ease: "power2.in" });
    };

    const onMouseUp = () => {
      gsap.to(point,  { scale: 1, duration: 0.45, ease: "elastic.out(1.2, 0.5)" });
      gsap.to([h, v], { scale: 1, duration: 0.45, ease: "elastic.out(1.2, 0.5)" });
    };

    const onEnter = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-cursor]")) return;
      gsap.to(point, { scale: 0, duration: 0.15, ease: "power2.out" });
      gsap.to(h, { scaleX: 2.5, background: "rgba(251,70,13,0.9)", duration: 0.25, ease: "power3.out" });
      gsap.to(v, { scaleY: 2.5, background: "rgba(251,70,13,0.9)", duration: 0.25, ease: "power3.out" });
    };

    const onLeave = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-cursor]")) return;
      gsap.to(point, { scale: 1, duration: 0.25, ease: "back.out(2)" });
      gsap.to(h, { scaleX: 1, background: "rgba(251,70,13,0.55)", duration: 0.25, ease: "power3.out" });
      gsap.to(v, { scaleY: 1, background: "rgba(251,70,13,0.55)", duration: 0.25, ease: "power3.out" });
    };

    window.addEventListener("mousemove",   onMove);
    window.addEventListener("mousedown",   onMouseDown);
    window.addEventListener("mouseup",     onMouseUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout",  onLeave);

    return () => {
      window.removeEventListener("mousemove",   onMove);
      window.removeEventListener("mousedown",   onMouseDown);
      window.removeEventListener("mouseup",     onMouseUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout",  onLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={pointRef} className="cursor-point" />
      <div ref={hRef}     className="cursor-h" />
      <div ref={vRef}     className="cursor-v" />
    </>
  );
}
