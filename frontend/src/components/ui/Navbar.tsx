"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Work",       href: "#projects"   },
  { label: "About",      href: "#about"      },
  { label: "Skills",     href: "#skills"     },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact"    },
];

export default function Navbar() {
  const navRef     = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);

  // Per-link refs (arrays)
  const linkInnerRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const linkIndexRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const linkArrowRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const linkDividerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  /* ── Entrance ── */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 3.2 }
    );
  }, []);

  /* ── Scroll backdrop ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Body scroll-lock ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── openMenu: 9-layer GSAP timeline ─────────────────────────────────────
  const openMenu = () => {
    setOpen(true);

    // 1. Overlay clip-path wipe
    gsap.to(overlayRef.current, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.7,
      ease: "power4.inOut",
    });

    // 2. Link inner mask reveal
    const inners = linkInnerRefs.current.filter(Boolean);
    if (inners.length) {
      gsap.fromTo(
        inners,
        { y: "110%" },
        { y: "0%", duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.45 }
      );
    }

    // 6. Index numbers
    const indices = linkIndexRefs.current.filter(Boolean);
    if (indices.length) {
      gsap.fromTo(
        indices,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08, delay: 0.5 }
      );
    }

    // 7. Arrows
    const arrows = linkArrowRefs.current.filter(Boolean);
    if (arrows.length) {
      gsap.fromTo(
        arrows,
        { x: -8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.09, delay: 0.55 }
      );
    }

    // 8. Per-link thin dividers scaleX draw
    const dividers = linkDividerRefs.current.filter(Boolean);
    if (dividers.length) {
      gsap.fromTo(
        dividers,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.5 }
      );
    }

  };

  // ── closeMenu: collapse + wipe ───────────────────────────────────────────
  const closeMenu = () => {
    const inners = linkInnerRefs.current.filter(Boolean);
    if (inners.length) {
      gsap.to(inners, { y: "110%", duration: 0.2, ease: "power3.in" });
    }
    const fadeOut = [
      ...linkIndexRefs.current.filter(Boolean),
      ...linkArrowRefs.current.filter(Boolean),
    ].filter(Boolean);
    if (fadeOut.length) {
      gsap.to(fadeOut, { opacity: 0, duration: 0.15 });
    }

    gsap.to(overlayRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.55,
      ease: "power4.inOut",
      delay: 0.1,
      onComplete: () => setOpen(false),
    });
  };

  const navigate = (href: string) => {
    closeMenu();
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 600);
  };

  return (
    <>
      {/* ── Nav bar ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full h-[72px] z-[1000] grid grid-cols-3 items-center px-[var(--gutter)] transition-[background,backdrop-filter,border-color] duration-500 ${
          scrolled
            ? "bg-[var(--bg-alpha-opaque)] backdrop-blur-[16px] border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          className="group relative inline-flex items-start gap-[5px] no-underline z-[1001]"
          data-cursor="link"
          onMouseEnter={() => {
            if (!logoTextRef.current) return;
            gsap.to(logoTextRef.current, {
              duration: 0.55,
              scrambleText: { text: "AM", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.7 },
              ease: "none",
            });
          }}
        >
          <span
            ref={logoTextRef}
            className="font-[var(--font-heading)] text-[22px] font-bold tracking-[-0.05em] leading-none text-[var(--text-primary)]"
          >
            AM
          </span>
          <span className="mt-[3px] w-[6px] h-[6px] bg-[var(--accent)] flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
        </a>

        {/* Hamburger — col 2, true center */}
        <div className="flex justify-center">
          <button
            type="button"
            className={`group flex items-center gap-2.5 bg-transparent border-none cursor-none z-[1001] text-[var(--text-primary)] transition-opacity duration-300 hover:opacity-70 ${open ? "nav-open" : ""}`}
            onClick={open ? closeMenu : openMenu}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative h-[1em] w-[3.5em] overflow-hidden font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="nav-btn-text-inner flex flex-col gap-[2px]">
                <span className="block h-[1em] leading-none">Menu</span>
                <span className="block h-[1em] leading-none">Close</span>
              </span>
            </span>
            <span className="relative flex h-[16px] w-[22px] flex-col items-center justify-center">
              <span className="nav-bar nav-bar-1 absolute h-[2px] w-full origin-center bg-current" />
              <span className="nav-bar nav-bar-2 absolute h-[2px] w-full origin-center bg-current" />
            </span>
          </button>
        </div>

        {/* Available for Work — col 3, right */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden sm:inline-flex group relative cursor-none border-none bg-transparent p-0 z-[1001]"
            data-cursor="link"
            aria-label="Available for Work — scroll to contact"
          >
            <span className="relative flex items-center gap-[6px]">
              <span className="flex shrink-0 items-center justify-center w-8 h-10 origin-left -rotate-45 scale-0 bg-[var(--accent)] text-white transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:rotate-0 group-hover:scale-100">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </span>
              <span className="flex items-center justify-center h-10 px-6 font-mono text-[11px] uppercase tracking-[0.14em] bg-[var(--accent)] text-white -translate-x-[38px] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0">
                Available for Work
              </span>
              <span className="absolute right-0 flex shrink-0 items-center justify-center w-8 h-10 origin-right bg-[var(--accent)] text-white transition-transform duration-700 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] group-hover:-rotate-45 group-hover:scale-0">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* ── Full-screen overlay ── */}
      <div
        ref={overlayRef}
        className={`nav-overlay-init fixed inset-0 z-[999] flex flex-col px-[var(--gutter)] pt-[calc(var(--nav-h)+clamp(20px,3vh,40px))] pb-[clamp(20px,3vh,40px)] bg-[var(--overlay-bg)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* ── Nav links ── */}
        <nav className="flex-1 flex flex-col justify-center">
          {NAV_LINKS.map((link, i) => (
            <div key={link.href}>
              {/* Per-link thin divider */}
              <div className="relative h-px overflow-hidden">
                <div
                  ref={(el) => { linkDividerRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[var(--border)] origin-left scale-x-0"
                />
              </div>

              <button
                type="button"
                className="group w-full flex items-center gap-[clamp(12px,2vw,28px)] py-[clamp(6px,1vh,14px)] bg-transparent border-none cursor-none text-left text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
                onClick={() => navigate(link.href)}
                data-cursor="link"
                onMouseEnter={(e) => {
                  const labelEl = e.currentTarget.querySelector(".nav-link-label") as HTMLElement;
                  if (labelEl) {
                    gsap.to(labelEl, {
                      duration: 0.5,
                      scrambleText: { text: link.label, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.6 },
                      ease: "none",
                    });
                  }
                  const arrowEl = linkArrowRefs.current[i];
                  if (arrowEl) gsap.to(arrowEl, { x: 6, duration: 0.25, ease: "power2.out" });
                }}
                onMouseLeave={() => {
                  const arrowEl = linkArrowRefs.current[i];
                  if (arrowEl) gsap.to(arrowEl, { x: 0, duration: 0.2, ease: "power2.in" });
                }}
              >
                {/* Index */}
                <span
                  ref={(el) => { linkIndexRefs.current[i] = el; }}
                  className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--accent)] shrink-0 opacity-0"
                >
                  0{i + 1}
                </span>

                {/* Masked label */}
                <div className="overflow-hidden flex-1 min-w-0">
                  <span
                    ref={(el) => { linkInnerRefs.current[i] = el; }}
                    className="block text-[clamp(38px,6.5vw,96px)] font-bold tracking-[-0.04em] leading-[1.05] font-[var(--font-heading)]"
                  >
                    <span className="nav-link-label">{link.label}</span>
                  </span>
                </div>

                {/* Arrow */}
                <span
                  ref={(el) => { linkArrowRefs.current[i] = el; }}
                  className="font-mono text-[clamp(14px,1.8vw,22px)] text-[var(--accent)] shrink-0 opacity-0"
                >
                  ↗
                </span>
              </button>
            </div>
          ))}

          {/* Final divider after last link */}
          <div className="relative h-px overflow-hidden">
            <div
              ref={(el) => { linkDividerRefs.current[NAV_LINKS.length] = el; }}
              className="absolute inset-0 bg-[var(--border)] origin-left scale-x-0"
            />
          </div>
        </nav>

      </div>
    </>
  );
}
