"use client";

import { useEffect, useRef } from "react";

interface WispParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

interface Props {
  color?: string;
  wispDensity?: number;
  wispSpeed?: number;
  flowSpeed?: number;
  flowStrength?: number;
  fogIntensity?: number;
  mouseTiltStrength?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function LaserFlow({
  color = "#fb460d",
  wispDensity = 1,
  wispSpeed = 15,
  flowSpeed = 0.35,
  flowStrength = 0.25,
  fogIntensity = 0.35,
  mouseTiltStrength = 0.04,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [r, g, b] = hexToRgb(color);
    const wisps: WispParticle[] = [];
    let w = 0;
    let h = 0;
    let rafId = 0;
    let time = 0;
    let mouseX = 0;
    let beamX = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      beamX = w * 0.5;
    };

    const spawnWisp = () => {
      const spread = w * 0.12;
      wisps.push({
        x: beamX + (Math.random() - 0.5) * spread * 2,
        y: h * (0.35 + Math.random() * 0.45),
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(wispSpeed * 0.04 + Math.random() * wispSpeed * 0.06),
        radius: 1.5 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.4,
        decay: 0.008 + Math.random() * 0.006,
      });
    };

    const drawBeam = () => {
      const pulse = Math.sin(time * flowSpeed) * flowStrength;
      const beamRadius = w * (0.18 + pulse * 0.04);

      // Core beam — narrow bright column
      const coreH = h * 0.9;
      const core = ctx.createRadialGradient(beamX, h * 0.5, 0, beamX, h * 0.5, beamRadius * 0.28);
      core.addColorStop(0, `rgba(${r},${g},${b},0.20)`);
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.fillRect(beamX - beamRadius, h * 0.5 - coreH / 2, beamRadius * 2, coreH);

      // Mid glow
      const mid = ctx.createRadialGradient(beamX, h * 0.5, 0, beamX, h * 0.5, beamRadius * 0.65);
      mid.addColorStop(0, `rgba(${r},${g},${b},${fogIntensity * 0.35})`);
      mid.addColorStop(0.5, `rgba(${r},${g},${b},${fogIntensity * 0.12})`);
      mid.addColorStop(1, "transparent");
      ctx.fillStyle = mid;
      ctx.fillRect(0, 0, w, h);

      // Outer fog haze
      const fog = ctx.createRadialGradient(beamX, h * 0.45, 0, beamX, h * 0.45, beamRadius * 1.4);
      fog.addColorStop(0, `rgba(${r},${g},${b},${fogIntensity * 0.08})`);
      fog.addColorStop(0.7, `rgba(${r},${g},${b},${fogIntensity * 0.03})`);
      fog.addColorStop(1, "transparent");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);
    };

    const drawWisps = () => {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      for (const p of wisps) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      }
      ctx.restore();
    };

    const tick = () => {
      time += 0.016;

      // Decay overlay — dark semi-transparent fill creates trailing glow
      ctx.fillStyle = "rgba(8,8,8,0.045)";
      ctx.fillRect(0, 0, w, h);

      // Lerp beam toward mouse influence
      const targetX = w * 0.5 + (mouseX - w * 0.5) * mouseTiltStrength;
      beamX += (targetX - beamX) * 0.04;

      drawBeam();

      // Spawn new wisps based on density
      const spawnCount = wispDensity * 0.5;
      if (Math.random() < spawnCount) spawnWisp();
      if (Math.random() < spawnCount * 0.4) spawnWisp();

      // Update & cull wisps
      for (let i = wisps.length - 1; i >= 0; i--) {
        const p = wisps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.radius *= 0.998;
        if (p.alpha <= 0.01) wisps.splice(i, 1);
      }

      drawWisps();

      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
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
  }, [color, wispDensity, wispSpeed, flowSpeed, flowStrength, fogIntensity, mouseTiltStrength]);

  return <canvas ref={canvasRef} className="laser-flow-canvas" />;
}
