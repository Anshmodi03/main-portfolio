"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  uniform vec3 color;
  uniform float opacity;
  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = glow * glow;
    gl_FragColor = vec4(color * glow, glow * opacity);
  }
`;

interface NebulaPlaneProps {
  size: number;
  position: [number, number, number];
  color: string;
  opacity: number;
  phase: number;
  period: number;
  amplitude: number;
}

function NebulaPlane({ size, position, color, opacity, phase, period, amplitude }: NebulaPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    opacity: { value: opacity },
  }), [color, opacity]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.x = position[0] + Math.cos((t / period) + phase) * amplitude;
    meshRef.current.position.y = position[1] + Math.sin((t / period) + phase) * amplitude * 0.6;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function NebulaBg() {
  return (
    <>
      {/* Primary glow — large, slow drift */}
      <NebulaPlane
        size={8}
        position={[0.5, 0.3, -2.5]}
        color="#FB460D"
        opacity={0.35}
        phase={0}
        period={7}
        amplitude={0.18}
      />
      {/* Secondary — medium, offset phase */}
      <NebulaPlane
        size={6}
        position={[-0.8, -0.5, -1.8]}
        color="#FF5722"
        opacity={0.20}
        phase={Math.PI * 0.6}
        period={11}
        amplitude={0.14}
      />
      {/* Accent — small, fast drift */}
      <NebulaPlane
        size={4}
        position={[1.0, -0.2, -1.2]}
        color="#FF7043"
        opacity={0.15}
        phase={Math.PI * 1.3}
        period={9}
        amplitude={0.1}
      />
    </>
  );
}
