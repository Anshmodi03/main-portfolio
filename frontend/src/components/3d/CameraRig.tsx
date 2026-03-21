"use client";

import { useFrame, useThree } from "@react-three/fiber";

/**
 * Mutable ref shared between GSAP (Hero scroll trigger) and R3F frame loop.
 * Plain object avoids React overhead — safe to mutate from any context.
 */
export const scrollProgress = { current: 0 };

/**
 * Renderless camera controller.
 * - Z dolly: zooms camera IN as hero scrolls away (1.0 → 0.4)
 * - Y drift: subtle downward drift as content scrolls
 * - X drift: gentle mouse-follow
 * All movement is lerp'd for smooth cinematic lag.
 */
export default function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    const t = scrollProgress.current;

    const targetZ = 1.0 - t * 0.6;       // zoom in as hero exits
    const targetY = -t * 0.15;            // subtle downward drift
    const targetX = mouse.x * 0.05;       // gentle mouse follow

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
  });

  return null;
}
