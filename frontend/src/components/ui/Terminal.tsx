"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { personal, skills, projects } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineType = "prompt" | "response" | "info" | "error";
type Line     = { type: LineType; text: string };

// ─── Commands ─────────────────────────────────────────────────────────────────

const COMMAND_NAMES = [
  "help", "about", "whoami", "skills", "projects",
  "contact", "socials", "github", "resume", "ls", "clear", "exit",
];

const COMMANDS: Record<string, Line[]> = {
  help: [
    { type: "response", text: "available commands:" },
    { type: "info",     text: "  about     — personal bio" },
    { type: "info",     text: "  whoami    — quick intro" },
    { type: "info",     text: "  skills    — technical expertise" },
    { type: "info",     text: "  projects  — featured work" },
    { type: "info",     text: "  contact   — get in touch" },
    { type: "info",     text: "  socials   — find me online" },
    { type: "info",     text: "  github    — open GitHub profile" },
    { type: "info",     text: "  resume    — view LinkedIn" },
    { type: "info",     text: "  ls        — list sections" },
    { type: "info",     text: "  clear     — reset terminal" },
    { type: "info",     text: "  exit      — close [esc]" },
  ],
  about: [
    { type: "response", text: `${personal.name} — ${personal.role}` },
    { type: "info",     text: `location   ${personal.location}` },
    { type: "info",     text: `status     ${personal.available ? "available for work ✓" : "not available"}` },
    { type: "info",     text: `"${personal.tagline}"` },
    { type: "info",     text: personal.bio },
  ],
  whoami: [
    { type: "response", text: `${personal.name} — ${personal.role}, ${personal.location}` },
    { type: "info",     text: `${personal.available ? "open to new opportunities ✓" : "not available right now"}` },
  ],
  skills: [
    { type: "response", text: "technical expertise:" },
    ...skills
      .filter((s) => s.level === "Expert" || s.level === "Advanced")
      .slice(0, 7)
      .map((s) => ({
        type: "info" as LineType,
        text: `  ${s.name.padEnd(26)} [${s.level}]`,
      })),
  ],
  projects: [
    { type: "response", text: "featured work:" },
    ...projects.map((p) => ({
      type: "info" as LineType,
      text: `  ${p.name} (${p.year})  →  ${p.live || p.github}`,
    })),
  ],
  contact: [
    { type: "response", text: "let's connect:" },
    { type: "info",     text: `  email     ${personal.email}` },
    { type: "info",     text: `  github    ${personal.github}` },
    { type: "info",     text: `  linkedin  ${personal.linkedin}` },
  ],
  socials: [
    { type: "response", text: "find me online:" },
    { type: "info",     text: `  github    ${personal.github}` },
    { type: "info",     text: `  linkedin  ${personal.linkedin}` },
  ],
  ls: [
    { type: "response", text: "sections/" },
    { type: "info",     text: "  hero  about  skills  projects  experience  exploring  process  contact" },
  ],
  resume: [
    { type: "response", text: "opening resume ↗" },
  ],
};

const WELCOME: Line = {
  type: "info",
  text: "welcome. type 'help' for commands.",
};

// ─── SVG corner paths ─────────────────────────────────────────────────────────
// viewBox 0 0 100 100 — L-brackets at each corner, 14 units long
const CORNER_PATHS = [
  "M 0 14 L 0 0 L 14 0",          // top-left
  "M 86 0 L 100 0 L 100 14",      // top-right
  "M 100 86 L 100 100 L 86 100",  // bottom-right
  "M 14 100 L 0 100 L 0 86",      // bottom-left
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Terminal() {
  const [open, setOpen]   = useState(false);
  const [lines, setLines] = useState<Line[]>([WELCOME]);
  const [input, setInput] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef  = useRef<HTMLDivElement>(null);
  const boxRef       = useRef<HTMLDivElement>(null);
  const outputRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const pathRefs     = useRef<SVGPathElement[]>([]);

  const openTlRef  = useRef<gsap.core.Timeline | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef    = useRef(false);   // stable ref for keyboard handler
  const bootedRef  = useRef(false);   // track first-open boot sequence

  // Command history
  const historyRef = useRef<string[]>([]);
  const histIdxRef = useRef(-1);

  // ── Keep openRef in sync ────────────────────────────────────────────────────
  useEffect(() => { openRef.current = open; }, [open]);

  // ── Global keyboard handler (registered once, reads ref) ───────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && openRef.current) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // no [open] dependency — reads openRef instead

  // ── GSAP open / close ──────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (open) {
      closeTlRef.current?.kill();
      gsap.set(containerRef.current, { display: "flex", pointerEvents: "auto" });

      const tl = gsap.timeline();
      openTlRef.current = tl;

      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" })
        .fromTo(
          boxRef.current,
          { scale: 0.93, opacity: 0, y: -8 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
          "<"
        )
        .from(
          pathRefs.current.filter(Boolean),
          { drawSVG: "0%", duration: 0.45, stagger: 0.06, ease: "power2.inOut" },
          0.08
        );

      // Boot sequence — first open only
      tl.call(() => {
        if (!bootedRef.current) {
          bootedRef.current = true;
          setLines([{ type: "info", text: "initializing system..." }]);
          // ScrambleText the first line after it renders
          setTimeout(() => {
            const firstLine = outputRef.current?.querySelector(".term-line span:last-child");
            if (firstLine) {
              gsap.to(firstLine, {
                duration: 0.7,
                scrambleText: { text: "system ready.", chars: "01!@#$%", speed: 0.6 },
                onComplete: () => {
                  setTimeout(() => setLines([WELCOME]), 400);
                },
              });
            } else {
              setTimeout(() => setLines([WELCOME]), 800);
            }
          }, 80);
        } else {
          inputRef.current?.focus();
        }
      }, [], 0.32);
    } else {
      openTlRef.current?.kill();

      // Skip if never opened (display: none already)
      if (
        !containerRef.current ||
        getComputedStyle(containerRef.current).display === "none"
      ) return;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(containerRef.current, { display: "none", pointerEvents: "none" });
        },
      });
      closeTlRef.current = tl;

      tl.to(boxRef.current,     { scale: 0.93, opacity: 0, y: -6, duration: 0.2, ease: "power3.in" })
        .to(backdropRef.current, { opacity: 0,                      duration: 0.15, ease: "power2.in" }, "<");
    }
  }, [open]);

  // ── After boot settles, focus input ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 1300);
    return () => clearTimeout(id);
  }, [open]);

  // ── Scroll output + animate new lines ──────────────────────────────────────
  useEffect(() => {
    if (!outputRef.current) return;
    outputRef.current.scrollTop = outputRef.current.scrollHeight;

    const lineEls = outputRef.current.querySelectorAll(".term-line");
    if (!lineEls.length) return;
    const recent = Array.from(lineEls).slice(-10);
    gsap.fromTo(
      recent,
      { y: 7, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, ease: "power2.out", overwrite: "auto" }
    );
  }, [lines]);

  // ── ScrambleText on the last "response" line ───────────────────────────────
  useEffect(() => {
    if (!outputRef.current) return;
    const responseDivs = outputRef.current.querySelectorAll(".term-line-response");
    if (!responseDivs.length) return;
    const last = responseDivs[responseDivs.length - 1];
    const textSpan = last?.querySelector("span:last-child");
    if (!textSpan || textSpan.getAttribute("data-scrambled") === "true") return;
    textSpan.setAttribute("data-scrambled", "true");
    gsap.to(textSpan, {
      duration: 0.55,
      scrambleText: { text: textSpan.textContent ?? "", chars: "01!@#$%", speed: 0.5 },
    });
  }, [lines]);

  // ── Command handler ─────────────────────────────────────────────────────────
  const handleCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    // Push to history
    if (historyRef.current[0] !== raw) historyRef.current.unshift(raw);
    histIdxRef.current = -1;

    const promptLine: Line = { type: "prompt", text: raw };

    if (cmd === "clear") {
      setLines([WELCOME]);
      return;
    }
    if (cmd === "exit") {
      setOpen(false);
      setLines([WELCOME]);
      return;
    }
    if (cmd === "github") {
      window.open(personal.github, "_blank", "noopener,noreferrer");
      setLines((prev) => [
        ...prev,
        promptLine,
        { type: "response", text: "opening GitHub ↗" },
      ]);
      return;
    }
    if (cmd === "resume") {
      window.open("/resume/resume.pdf", "_blank", "noopener,noreferrer");
      setLines((prev) => [...prev, promptLine, ...COMMANDS.resume]);
      return;
    }

    const result = COMMANDS[cmd];
    if (result) {
      setLines((prev) => [...prev, promptLine, ...result]);
    } else {
      setLines((prev) => [
        ...prev,
        promptLine,
        { type: "error", text: `'${cmd}' not found. type 'help' for commands.` },
      ]);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  // ── Input key handling (history + autocomplete) ─────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdxRef.current + 1, historyRef.current.length - 1);
      if (historyRef.current.length === 0) return;
      histIdxRef.current = next;
      setInput(historyRef.current[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = next;
      setInput(next === -1 ? "" : (historyRef.current[next] ?? ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const match = COMMAND_NAMES.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  // ── Line style maps ──────────────────────────────────────────────────────────
  const lineClass: Record<LineType, string> = {
    prompt:   "text-[var(--text-primary)]",
    response: "text-[var(--accent)]",
    info:     "text-[var(--text-muted)]",
    error:    "text-red-400",
  };
  const linePrefix: Record<LineType, string> = {
    prompt:   "›",
    response: "→",
    info:     " ",
    error:    "✕",
  };
  const lineExtraClass: Record<LineType, string> = {
    prompt:   "",
    response: "term-line-response",
    info:     "",
    error:    "",
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9990] hidden items-start justify-center pt-[10vh] px-4 pointer-events-none"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Glow behind box */}
      <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[var(--accent-glow)] blur-[80px] pointer-events-none opacity-60" />

      {/* Terminal box */}
      <div
        ref={boxRef}
        className="relative z-[9991] w-full max-w-[720px] bg-[var(--bg-surface)] border border-[var(--border-strong)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* DrawSVG corner brackets */}
        <svg
          className="absolute pointer-events-none terminal__corners-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {CORNER_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="var(--accent)"
              strokeWidth="0.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
              ref={(el) => { if (el) pathRefs.current[i] = el; }}
            />
          ))}
        </svg>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <span className="relative flex-shrink-0">
              <span className="block w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="pulse-ring" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
              // ansh.modi — terminal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] hidden sm:block">
              ctrl+k · esc
            </span>
            <button
              onClick={() => setOpen(false)}
              className="font-mono text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150 cursor-pointer leading-none"
              data-cursor="link"
              aria-label="Close terminal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="h-[400px] overflow-y-auto p-5 flex flex-col gap-[2px] terminal__output"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`term-line ${lineExtraClass[line.type]} font-mono text-[12px] leading-[1.6] flex gap-2 ${lineClass[line.type]}`}
            >
              <span className="opacity-40 select-none flex-shrink-0 w-3 pt-px">
                {linePrefix[line.type]}
              </span>
              <span className="break-words min-w-0 flex-1">{line.text}</span>
            </div>
          ))}
        </div>

        {/* Input row */}
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 border-t border-[var(--border)] px-5 py-3"
        >
          <span className="font-mono text-[12px] text-[var(--accent)] select-none leading-none">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="enter command..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/35 caret-[var(--accent)]"
          />
          <span className="terminal__cursor font-mono text-[12px] text-[var(--accent)] select-none leading-none">▋</span>
        </form>

        {/* Hint bar */}
        <div className="px-5 py-2 border-t border-[var(--border)] flex gap-4">
          <span className="font-mono text-[10px] text-[var(--text-muted)]/50 tracking-[0.1em]">
            ↑↓ history
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]/50 tracking-[0.1em]">
            tab autocomplete
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]/50 tracking-[0.1em]">
            esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
