"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgress } from "./CameraRig";

const DUST_COUNT = 4800;
const STAR_COUNT = 200;

const DUST_COLORS = [
  new THREE.Color("#FB460D"),
  new THREE.Color("#FF5722"),
  new THREE.Color("#888888"),
  new THREE.Color("#FF7043"),
  new THREE.Color("#AAAAAA"),
];

const STAR_COLORS = [
  new THREE.Color("#FFFFFF"),
  new THREE.Color("#FB460D"),
  new THREE.Color("#FFD700"),
];

/** Galaxy-arm distribution across 4 spiral arms. */
function galaxyPositions(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = DUST_COLORS;

  for (let i = 0; i < count; i++) {
    const arm = Math.floor(Math.random() * 4) * (Math.PI / 2);
    const r = Math.pow(Math.random(), 0.6) * 2.8;
    const spread = (Math.random() - 0.5) * 0.6;
    const theta = arm + r * 0.9 + spread;

    positions[i * 3]     = r * Math.cos(theta);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6 * (1.0 - r / 4.0);
    positions[i * 3 + 2] = r * Math.sin(theta);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return { positions, colors };
}

/** Bright stars — random scatter, fewer and larger. */
function starPositions(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.4) * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return { positions, colors };
}

export default function ParticleField() {
  const dustRef = useRef<THREE.Points>(null!);
  const starRef = useRef<THREE.Points>(null!);

  const dust = useMemo(() => galaxyPositions(DUST_COUNT), []);
  const stars = useMemo(() => starPositions(STAR_COUNT), []);

  useFrame((state) => {
    if (!dustRef.current || !starRef.current) return;
    const { mouse, clock } = state;
    const time = clock.elapsedTime;

    // Slow cinematic rotation + z-axis tilt
    dustRef.current.rotation.y += 0.0002;
    dustRef.current.rotation.z += 0.00006;
    dustRef.current.rotation.x = Math.sin(time * 0.08) * 0.04;

    starRef.current.rotation.y = dustRef.current.rotation.y;
    starRef.current.rotation.z = dustRef.current.rotation.z;
    starRef.current.rotation.x = dustRef.current.rotation.x;

    // Mouse parallax — reduced strength for subtlety
    dustRef.current.rotation.y += (mouse.x * 0.2 - dustRef.current.rotation.y) * 0.015;
    dustRef.current.rotation.x += (mouse.y * 0.15 - dustRef.current.rotation.x) * 0.015;

    // Scroll-reactive scale — galaxy expands as camera zooms in
    const scale = 1 + scrollProgress.current * 0.5;
    dustRef.current.scale.setScalar(scale);
    starRef.current.scale.setScalar(scale);
  });

  return (
    <>
      {/* Fine galaxy dust — dense, small particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dust.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.006}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Bright stars — sparse, large, high contrast */}
      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[stars.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
