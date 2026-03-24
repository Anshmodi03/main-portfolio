"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Separator } from "@/components/ui/separator";

type GitHubData = {
  repos:     number;
  followers: number;
  stars:     number;
  languages: { name: string; pct: number }[];
};

const FALLBACK: GitHubData = {
  repos: 40, followers: 20, stars: 15,
  languages: [
    { name: "JavaScript", pct: 55 },
    { name: "TypeScript", pct: 30 },
    { name: "CSS",        pct: 10 },
    { name: "HTML",       pct: 4  },
    { name: "Python",     pct: 1  },
  ],
};

export default function GitHubStats() {
  const sectionRef  = useRef<HTMLElement>(null);
  const h2Ref       = useRef<HTMLHeadingElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const langsRef    = useRef<HTMLDivElement>(null);

  // Counter refs
  const reposRef    = useRef<HTMLSpanElement>(null);
  const starsRef    = useRef<HTMLSpanElement>(null);
  const followRef   = useRef<HTMLSpanElement>(null);

  // Language bar fill refs
  const barFillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [data, setData] = useState<GitHubData | null>(null);

  // Fetch real data
  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d: GitHubData) => setData(d))
      .catch(() => setData(FALLBACK));
  }, []);

  const live = data ?? FALLBACK;

  useLayoutEffect(() => {
    if (!data) return; // wait until data resolves

    const ctx = gsap.context(() => {
      // H2 SplitText lines reveal
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // Stat counters
      const counterDefs = [
        { ref: reposRef,  target: live.repos     },
        { ref: starsRef,  target: live.stars      },
        { ref: followRef, target: live.followers  },
      ];
      counterDefs.forEach(({ ref, target }) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%", once: true },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = Math.round(obj.val) + "+";
          },
        });
      });

      // Stats row fade-up stagger
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".stat-cell") ?? [],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: statsRef.current, start: "top 82%" },
        }
      );

      // Language bars scaleX fill — set width per-bar via gsap.set (no inline styles)
      live.languages.forEach((lang, i) => {
        const bar = barFillRefs.current[i];
        if (!bar) return;
        gsap.set(bar, { width: `${lang.pct}%` });
      });
      const fills = barFillRefs.current.filter(Boolean) as HTMLDivElement[];
      if (fills.length) {
        gsap.fromTo(
          fills,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: langsRef.current, start: "top 80%" },
          }
        );
      }

      // Language rows fade-up
      gsap.fromTo(
        langsRef.current?.querySelectorAll(".lang-row") ?? [],
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: langsRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [data, live.repos, live.stars, live.followers]);

  return (
    <section
      id="github-stats"
      ref={sectionRef}
      className="relative bg-[var(--bg-surface)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* Eyebrow */}
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6">
        // Open Source
      </p>

      {/* H2 */}
      <h2
        ref={h2Ref}
        className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(48px,6vh,96px)] font-[var(--font-heading)]"
      >
        Code &amp; Activity
      </h2>

      {/* Stats grid */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--border)] mb-[clamp(48px,6vh,96px)]"
      >
        {/* Repos */}
        <div className="stat-cell bg-[var(--bg-surface)] p-10 flex flex-col gap-3">
          <span
            ref={reposRef}
            className="text-[clamp(48px,5vw,80px)] font-bold tracking-[-0.04em] leading-none tabular-nums font-[var(--font-heading)]"
          >
            0+
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Repositories
          </span>
        </div>

        {/* Stars */}
        <div className="stat-cell bg-[var(--bg-surface)] p-10 flex flex-col gap-3">
          <span
            ref={starsRef}
            className="text-[clamp(48px,5vw,80px)] font-bold tracking-[-0.04em] leading-none tabular-nums font-[var(--font-heading)]"
          >
            0+
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Stars Earned
          </span>
        </div>

        {/* Followers */}
        <div className="stat-cell col-span-2 md:col-span-1 bg-[var(--bg-surface)] p-10 flex flex-col gap-3">
          <span
            ref={followRef}
            className="text-[clamp(48px,5vw,80px)] font-bold tracking-[-0.04em] leading-none tabular-nums font-[var(--font-heading)]"
          >
            0+
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Followers
          </span>
        </div>
      </div>

      <Separator className="bg-[var(--border)] mb-[clamp(48px,6vh,96px)]" />

      {/* Languages */}
      <div ref={langsRef}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-10">
          // Top Languages
        </p>

        <div className="flex flex-col gap-6 max-w-2xl">
          {/* Skeleton while loading */}
          {!data && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="lang-row flex items-center gap-4">
                <div className="w-24 h-3 bg-[var(--border)] animate-pulse rounded-none" />
                <div className="flex-1 h-[2px] bg-[var(--border)] animate-pulse" />
                <div className="w-8 h-3 bg-[var(--border)] animate-pulse rounded-none" />
              </div>
            ))
          )}

          {/* Real data */}
          {data && live.languages.map((lang, i) => (
            <div key={lang.name} className="lang-row flex items-center gap-4">
              <span className="w-24 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] flex-shrink-0">
                {lang.name}
              </span>
              <div className="flex-1 h-[2px] bg-[var(--border)] relative overflow-hidden">
                <div
                  ref={(el) => { barFillRefs.current[i] = el; }}
                  className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-[var(--text-muted)] w-8 text-right flex-shrink-0">
                {lang.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub CTA */}
      <div className="mt-16">
        <a
          href="https://github.com/Anshmodi03"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 no-underline group"
          data-cursor="link"
        >
          <span className="w-8 h-px bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors duration-200" />
          View on GitHub
          <span className="group-hover:translate-x-1 transition-transform duration-200">↗</span>
        </a>
      </div>
    </section>
  );
}
