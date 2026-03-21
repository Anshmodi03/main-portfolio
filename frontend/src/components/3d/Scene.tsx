"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import FloatingGrid from "./FloatingGrid";
import PostFX from "./PostFX";
import NebulaBg from "./NebulaBg";
import CameraRig from "./CameraRig";
import { useIsMobile } from "@/hooks/useMediaQuery";

function SceneContent({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <CameraRig />
      <NebulaBg />
      <ParticleField />
      {!isMobile && <FloatingGrid />}
      {!isMobile && <PostFX />}
    </>
  );
}

export default function Scene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      className="scene-canvas"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
      camera={{ position: [0, 0, 1], fov: 75 }}
    >
      <Suspense fallback={null}>
        <SceneContent isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
