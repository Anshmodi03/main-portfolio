"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

const NAV_LINKS = [
  { label: "Work",       href: "#projects" },
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact" },
];

export default function Navbar() {
  const navRef       = useRef<HTMLElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const logoTextRef  = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);
  }, []);

  /* Entrance — delayed until after preloader (~3.1s) */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 3.2 }
    );
  }, []);

  /* Scroll backdrop */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Body scroll-lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openMenu = () => {
    setOpen(true);
    gsap.to(overlayRef.current, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
    gsap.fromTo(
      ".nav-overlay-link",
      { y: "80%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.3 }
    );
  };

  const closeMenu = () => {
    gsap.to(".nav-overlay-link", { y: "80%", opacity: 0, duration: 0.2, ease: "power3.in" });
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
      {/* Nav bar */}
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
          {/* Accent square — top-right dot */}
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
            {/* Sliding Menu/Close text — CSS transition via nav-btn-text-inner */}
            <span className="relative h-[1em] w-[3.5em] overflow-hidden font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="nav-btn-text-inner flex flex-col gap-[2px]">
                <span className="block h-[1em] leading-none">Menu</span>
                <span className="block h-[1em] leading-none">Close</span>
              </span>
            </span>
            {/* 2-bar X icon */}
            <span className="relative flex h-[16px] w-[22px] flex-col items-center justify-center">
              <span className="nav-bar nav-bar-1 absolute h-[2px] w-full origin-center bg-current" />
              <span className="nav-bar nav-bar-2 absolute h-[2px] w-full origin-center bg-current" />
            </span>
          </button>
        </div>

        {/* Available for Work — col 3, right-aligned */}
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

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        className={`nav-overlay-init fixed inset-0 z-[999] flex flex-col justify-center px-[var(--gutter)] pt-[calc(var(--nav-h)+40px)] pb-[var(--gutter)] overflow-hidden bg-[var(--overlay-bg)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Giant nav links */}
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <div key={link.href} className="overflow-hidden">
              <button
                type="button"
                className="nav-overlay-link block w-full text-left text-[clamp(48px,9vw,110px)] font-bold tracking-[-0.04em] leading-[1.0] text-[var(--text-muted)] bg-transparent border-none hover:text-[var(--text-primary)] transition-colors duration-200 cursor-none font-[var(--font-heading)]"
                onClick={() => navigate(link.href)}
                data-cursor="link"
                onMouseEnter={(e) => {
                  const labelEl = e.currentTarget.querySelector(".nav-link-label") as HTMLElement;
                  if (!labelEl) return;
                  gsap.to(labelEl, {
                    duration: 0.5,
                    scrambleText: { text: link.label, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.6 },
                    ease: "none",
                  });
                }}
              >
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--accent)] mr-4 align-middle">
                  0{i + 1}
                </span>
                <span className="nav-link-label">{link.label}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Footer bar */}
        <div className="absolute bottom-[var(--gutter)] left-[var(--gutter)] right-[var(--gutter)] flex justify-end items-center border-t border-[rgba(255,255,255,0.08)] pt-6">
          <div className="flex gap-5">
            <a
              href="https://github.com/Anshmodi03"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors"
              data-cursor="link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/ansh-modi-"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors"
              data-cursor="link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
