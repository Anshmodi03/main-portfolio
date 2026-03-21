"use client";

import { useEffect, ReactNode } from "react";

// Import side-effectful registration
import "@/lib/gsap";

interface Props {
  children: ReactNode;
}

export default function GSAPProvider({ children }: Props) {
  useEffect(() => {
    // GSAP plugins are registered in lib/gsap.ts on import
    // This provider ensures the module is loaded client-side
  }, []);

  return <>{children}</>;
}
