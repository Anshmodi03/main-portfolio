"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
    ScrambleTextPlugin,
    MotionPathPlugin
  );

  // Signature custom easing curves
  CustomEase.create("smoothOut", "M0,0 C0.25,0.46 0.45,0.94 1,1");
  CustomEase.create("dramatic", "M0,0 C0.77,0 0.175,1 1,1");
  CustomEase.create("elasticOut", "M0,0 C0.6,-0.28 0.74,1.35 1,1");

  // Global GSAP defaults — every tween gets GPU acceleration
  gsap.defaults({
    ease: "smoothOut",
    duration: 0.8,
  });
}

// Sync Lenis smooth scroll with GSAP ScrollTrigger
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function syncLenisWithGSAP(lenis: any) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, CustomEase, ScrambleTextPlugin };
