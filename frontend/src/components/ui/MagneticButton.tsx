"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import { gsap } from "gsap";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  cursorText?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.4,
  cursorText = "VIEW",
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(ref.current, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
  };

  const sharedProps = {
    "data-cursor": "magnetic",
    "data-cursor-text": cursorText,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn("inline-block", className),
  };

  if (href) {
    return (
      <div ref={ref} {...sharedProps}>
        <a href={href} target={target} rel={rel} aria-label={ariaLabel}>
          {children}
        </a>
      </div>
    );
  }

  return (
    <div ref={ref} {...sharedProps}>
      <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
        {children}
      </button>
    </div>
  );
}
