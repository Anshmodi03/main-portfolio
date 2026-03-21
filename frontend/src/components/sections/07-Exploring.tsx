"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { exploring } from "@/lib/data";

const ORBIT_CONFIG = [
  { rx: 280, ry: 100, startAngle: 0,   speed: 18  },
  { rx: 200, ry: 70,  startAngle: 60,  speed: 22  },
  { rx: 340, ry: 120, startAngle: 120, speed: 26  },
  { rx: 180, ry: 65,  startAngle: 180, speed: 20  },
  { rx: 310, ry: 110, startAngle: 240, speed: 24  },
  { rx: 240, ry: 85,  startAngle: 300, speed: 16  },
  { rx: 360, ry: 130, startAngle: 90,  speed: 28  },
];

const STATUS_CLASS: Record<string, string> = {
  Learning:   "exploring-badge--learning",
  Exploring:  "exploring-badge--exploring",
  Interested: "exploring-badge--interested",
};

export default function Exploring() {
  const sectionRef  = useRef<HTMLElement>(null);
  const centerRef   = useRef<HTMLDivElement>(null);
  const badgeRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const trailRefs   = useRef<(SVGLineElement | null)[]>([]);
  const svgRef      = useRef<SVGSVGElement>(null);
  const bgGlowRef   = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);

    const badges  = badgeRefs.current;
    const trails  = trailRefs.current;
    const configs = ORBIT_CONFIG.slice(0, exploring.length);

    // Parallax glow blob
    gsap.to(bgGlowRef.current, {
      y: "-20%",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // ScrambleText on heading
    gsap.to(headingRef.current, {
      duration: 0.9,
      scrambleText: { text: "What I'm Exploring", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.4 },
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
    });

    // Set initial positions
    configs.forEach((cfg, i) => {
      const rad = (cfg.startAngle * Math.PI) / 180;
      if (badges[i]) {
        gsap.set(badges[i], {
          x: Math.cos(rad) * cfg.rx,
          y: Math.sin(rad) * cfg.ry,
          opacity: 0,
          scale: 0.7,
        });
      }
    });

    // Entrance: badges pop in on scroll
    gsap.to(badges, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.4)",
      stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });

    // Center glow pulse
    gsap.to(centerRef.current, {
      boxShadow: "0 0 60px 8px rgba(251,70,13,0.55)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Continuous orbit + trail update via rAF
    const startTime = Date.now();
    let rafId: number;

    const loop = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const svgEl   = svgRef.current;

      configs.forEach((cfg, i) => {
        const angle = ((cfg.startAngle + elapsed * (360 / cfg.speed)) * Math.PI) / 180;
        const bx    = Math.cos(angle) * cfg.rx;
        const by    = Math.sin(angle) * cfg.ry;

        if (badges[i]) gsap.set(badges[i], { x: bx, y: by });

        // Update SVG trail line from center to badge
        if (trails[i] && svgEl) {
          const cx = svgEl.clientWidth  / 2;
          const cy = svgEl.clientHeight / 2;
          trails[i]!.setAttribute("x1", String(cx));
          trails[i]!.setAttribute("y1", String(cy));
          trails[i]!.setAttribute("x2", String(cx + bx));
          trails[i]!.setAttribute("y2", String(cy + by));
        }
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="exploring" ref={sectionRef} className="exploring-section exploring-section--rel">
      <div ref={bgGlowRef} className="section-bg-accent exploring-section__glow" />
      <div className="exploring-container">
        <p className="section-label">// Exploration</p>
        <h2 ref={headingRef} className="exploring-h2">What I&apos;m Exploring</h2>
        <p className="exploring-subtitle">Always learning, always building.</p>

        <div className="exploring-orbit-wrap">
          {/* Center avatar */}
          <div ref={centerRef} className="exploring-center">AM</div>

          {/* Decorative orbit ellipses + live trail lines */}
          <svg ref={svgRef} className="exploring-svg" aria-hidden="true">
            <ellipse cx="50%" cy="50%" rx="280" ry="100" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 8" />
            <ellipse cx="50%" cy="50%" rx="200" ry="70"  fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
            <ellipse cx="50%" cy="50%" rx="340" ry="120" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
            {exploring.map((_, i) => (
              <line
                key={i}
                ref={(el) => { trailRefs.current[i] = el; }}
                className="exploring-trail"
              />
            ))}
          </svg>

          {/* Orbiting badges */}
          {exploring.map((item, i) => (
            <div
              key={item.name}
              ref={(el) => { badgeRefs.current[i] = el; }}
              className="exploring-badge-wrap"
            >
              <div
                data-cursor="link"
                className={`exploring-badge ${STATUS_CLASS[item.status] ?? "exploring-badge--interested"}`}
              >
                <span className="exploring-badge__icon">{item.icon}</span>
                <div>
                  <p className="exploring-badge__name">{item.name}</p>
                  <p className="exploring-badge__status">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
