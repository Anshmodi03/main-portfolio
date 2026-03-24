"use client";

import { useEffect, useState, ReactNode } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/hooks/useLenis";
import { syncLenisWithGSAP } from "@/lib/gsap";

interface Props {
  children: ReactNode;
}

export default function LenisProvider({ children }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Force scroll to top on every page load/reload — prevent browser scroll restoration
    if (typeof history !== "undefined") history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.6,
    });

    // Also reset Lenis's own scroll position
    instance.scrollTo(0, { immediate: true });
    setLenis(instance);
    syncLenisWithGSAP(instance);

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
