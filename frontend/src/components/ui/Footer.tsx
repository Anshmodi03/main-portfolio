"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[var(--bg-base)] border-t border-[var(--border)] py-[clamp(24px,4vh,40px)] px-[var(--gutter)] flex flex-wrap justify-between items-center gap-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        ANSH MODI — © {year}
      </span>

      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)] hidden md:block">
        DESIGNED &amp; BUILT WITH NEXT.JS + GSAP
      </span>

      <div className="flex gap-6">
        <a
          href="https://github.com/Anshmodi03"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors"
          data-cursor="link"
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/in/ansh-modi-"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors"
          data-cursor="link"
        >
          LinkedIn ↗
        </a>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent border-none transition-colors"
          data-cursor="link"
          aria-label="Scroll to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
}
