"use client";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  DepthOfField,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export default function PostFX() {
  return (
    <EffectComposer>
      {/* DOF — blurs distant nebula planes, keeps near particles in focus */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.015}
        bokehScale={4}
        height={480}
      />
      {/* Bloom — lower threshold catches more glowing particles */}
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        intensity={2.0}
        radius={0.6}
        blendFunction={BlendFunction.ADD}
      />
      {/* Chromatic aberration — radial modulation for cinematic edge fringe */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0025, 0.001)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.15}
      />
      {/* WebGL film grain — layered on top of SVG noise overlay */}
      <Noise
        opacity={0.04}
        blendFunction={BlendFunction.SCREEN}
      />
      {/* Vignette — slightly darker for cinematic feel */}
      <Vignette
        offset={0.4}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
