"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Two grids at different Z depths create a parallax "infinite tunnel" effect
 * as the CameraRig dollies the camera forward on scroll.
 * Grids animate at different phases for independent motion.
 */
export default function FloatingGrid() {
  const nearRef = useRef<THREE.GridHelper>(null!);
  const farRef  = useRef<THREE.GridHelper>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (nearRef.current) {
      nearRef.current.rotation.z = Math.sin(t * 0.08) * 0.03;
      nearRef.current.position.y = -1.8 + Math.sin(t * 0.15) * 0.06;
    }

    if (farRef.current) {
      // Phase offset by PI/2 — independent breathing motion
      farRef.current.rotation.z = Math.sin(t * 0.06 + Math.PI * 0.5) * 0.025;
      farRef.current.position.y = -2.2 + Math.sin(t * 0.12 + Math.PI * 0.5) * 0.05;
    }
  });

  return (
    <>
      {/* Near grid — faint accent lines, more visible */}
      <gridHelper
        ref={nearRef}
        args={[20, 25, "#2A1005", "#111111"]}
        position={[0, -1.8, -1.5]}
        rotation={[Math.PI * 0.12, 0, 0]}
      />
      {/* Far grid — even fainter, larger cells, creates depth */}
      <gridHelper
        ref={farRef}
        args={[30, 18, "#1A0A03", "#0A0A0A"]}
        position={[0, -2.2, -4.0]}
        rotation={[Math.PI * 0.1, 0, 0]}
      />
    </>
  );
}
