"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { experiences } from "@/lib/data";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<SVGPathElement>(null);
  const bgGlowRef  = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin);

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
        scrambleText: { text: "Professional Journey", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.4 },
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });

      // DrawSVGPlugin — draw line from 0% to 100% as user scrolls
      gsap.from(lineRef.current, {
        drawSVG: "0%",
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      // Cards stagger in from alternating sides
      const cards = sectionRef.current?.querySelectorAll(".exp-card");
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
            }
          );
        });
      }

      // Dot pulse on enter
      const dots = sectionRef.current?.querySelectorAll(".exp-dot");
      if (dots) {
        dots.forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: "back.out(2)",
              scrollTrigger: { trigger: dot, start: "top 85%" },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="experience-section experience-section--rel">
      <div ref={bgGlowRef} className="section-bg-accent experience-section__glow" />
      <div className="experience-container">
        <p className="section-label">// Experience</p>
        <h2 ref={headingRef} className="experience-h2">Professional Journey</h2>

        <div className="experience-timeline">
          {/* DrawSVG centerline */}
          <svg className="experience-svg-line" aria-hidden="true">
            <path
              ref={lineRef}
              d="M 1 0 L 1 3000"
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="experience-entries">
            {experiences.map((exp, i) => (
              <div key={exp.company} className="exp-card">
                {i % 2 === 0 ? <ExpContent exp={exp} /> : <div className="exp-card__empty" />}
                <div className="exp-dot-wrap">
                  <div className="exp-dot" />
                </div>
                {i % 2 !== 0 ? <ExpContent exp={exp} /> : <div className="exp-card__empty" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpContent({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <div className="exp-content">
      <div className="exp-content__header">
        <h3 className="exp-content__role">{exp.role}</h3>
        <span className="exp-content__duration">{exp.duration}</span>
      </div>
      <p className="exp-content__company">{exp.company}</p>
      <p className="exp-content__desc">{exp.description}</p>
      {exp.achievements && (
        <ul className="exp-content__achievements">
          {exp.achievements.map((a) => (
            <li key={a} className="exp-content__achievement">
              <span className="exp-content__achievement-arrow">↳ </span>{a}
            </li>
          ))}
        </ul>
      )}
      <div className="exp-content__chips">
        {exp.tech.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
    </div>
  );
}
