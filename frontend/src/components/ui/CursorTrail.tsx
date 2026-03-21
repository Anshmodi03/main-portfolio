"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

const TRAIL_LENGTH = 32;
const ACCENT_R = 251;
const ACCENT_G = 70;
const ACCENT_B = 13;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: Array<{ x: number; y: number }> = [];
    let rafId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      points.unshift({ x: e.clientX, y: e.clientY });
      if (points.length > TRAIL_LENGTH) points.length = TRAIL_LENGTH;
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 1; i < points.length; i++) {
          const t = 1 - i / TRAIL_LENGTH;          // 1 = newest, 0 = oldest
          const alpha = t * t * 0.65;               // quadratic fade
          const lineW = 0.5 + t * 2.5;             // taper: thick near cursor

          ctx.beginPath();
          ctx.moveTo(points[i - 1].x, points[i - 1].y);
          ctx.lineTo(points[i].x, points[i].y);

          ctx.strokeStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha})`;
          ctx.lineWidth = lineW;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha * 0.8})`;
          ctx.stroke();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return <canvas ref={canvasRef} className="cursor-trail-canvas" />;
}
