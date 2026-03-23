"use client";

import { cn } from "@/lib/utils";

const CrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

// "accent" → orange bg + white text (default)
// "light"  → white/primary bg + dark text (for secondary actions like GitHub)
const VARIANT_PANEL: Record<string, string> = {
  accent: "bg-[var(--accent)] text-white",
  light:  "bg-[var(--text-primary)] text-[var(--bg-base)]",
};

interface SpinButtonBaseProps {
  label: string;
  variant?: "accent" | "light";
  className?: string;
  ariaLabel?: string;
}

interface SpinButtonLinkProps extends SpinButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface SpinButtonButtonProps extends SpinButtonBaseProps {
  href?: never;
  target?: never;
  rel?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

type SpinButtonProps = SpinButtonLinkProps | SpinButtonButtonProps;

export default function SpinButton(props: SpinButtonProps) {
  const { label, className, ariaLabel, variant = "accent" } = props;
  const panel = VARIANT_PANEL[variant];

  const inner = (
    <span className="relative flex items-center gap-[6px]">
      {/* Left icon — hidden at rest, spins in on hover */}
      <span className={cn(
        "flex shrink-0 items-center justify-center w-8 h-10 origin-left -rotate-45 scale-0",
        "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]",
        "group-hover:rotate-0 group-hover:scale-100",
        panel
      )}>
        <CrossIcon />
      </span>
      {/* Center label — slides right on hover */}
      <span className={cn(
        "flex items-center justify-center h-10 px-6 font-mono text-[11px] uppercase tracking-[0.14em]",
        "-translate-x-[38px] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]",
        "group-hover:translate-x-0",
        panel
      )}>
        {label}
      </span>
      {/* Right icon — visible at rest, spins out on hover */}
      <span className={cn(
        "absolute right-0 flex shrink-0 items-center justify-center w-8 h-10 origin-right",
        "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]",
        "group-hover:-rotate-45 group-hover:scale-0",
        panel
      )}>
        <CrossIcon />
      </span>
    </span>
  );

  if (props.href !== undefined) {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        aria-label={ariaLabel ?? label}
        data-cursor="link"
        className={cn(
          "group relative inline-flex cursor-none border-none bg-transparent p-0 no-underline",
          className
        )}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={ariaLabel ?? label}
      data-cursor="link"
      className={cn(
        "group relative inline-flex cursor-none border-none bg-transparent p-0",
        props.disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      {inner}
    </button>
  );
}
