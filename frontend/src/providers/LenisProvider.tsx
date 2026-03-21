"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/hooks/useLenis";
import { syncLenisWithGSAP } from "@/lib/gsap";

interface Props {
  children: ReactNode;
}

export default function LenisProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    syncLenisWithGSAP(lenis);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
