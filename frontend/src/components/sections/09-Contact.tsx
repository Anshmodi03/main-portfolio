"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SpinButton from "@/components/ui/SpinButton";
import { personal } from "@/lib/data";

// ── Zod schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

// ── Shared input style ────────────────────────────────────────────────────────

const INPUT_CLASS =
  "rounded-none border-0 border-b border-[var(--border)] bg-transparent px-0 h-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-0 focus-visible:border-[var(--accent)] transition-colors duration-200";

// ── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef   = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const formCardRef  = useRef<HTMLDivElement>(null);
  const infoCardRef  = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLSpanElement>(null);
  const socialRefs   = useRef<(HTMLAnchorElement | null)[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Watermark parallax ──────────────────────────────────────────────
      gsap.to(watermarkRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });

      // ── 2. Eyebrow ScrambleText ────────────────────────────────────────────
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, {
          duration: 0.9,
          scrambleText: { text: "// Contact", chars: "01!#?$", speed: 0.7 },
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 82%", once: true },
        });
      }

      // ── 3. H2 SplitText chars ─────────────────────────────────────────────
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "chars,words" });
        gsap.fromTo(
          split.chars,
          { y: 72, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, ease: "dramatic", stagger: 0.018,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert(),
          }
        );
      }

      // ── 4. Separator scaleX draw ───────────────────────────────────────────
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1.0, ease: "power3.out",
            scrollTrigger: { trigger: lineRef.current, start: "top 80%", once: true },
          }
        );
      }

      // ── 5. Form card entrance ──────────────────────────────────────────────
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: "back.out(1.2)",
            scrollTrigger: { trigger: formCardRef.current, start: "top 78%", once: true },
          }
        );
      }

      // ── 6. Info card entrance ──────────────────────────────────────────────
      if (infoCardRef.current) {
        gsap.fromTo(
          infoCardRef.current,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: "back.out(1.2)", delay: 0.1,
            scrollTrigger: { trigger: infoCardRef.current, start: "top 78%", once: true },
          }
        );
      }

      // ── 7. .contact-reveal field stagger ──────────────────────────────────
      const revealEls = sectionRef.current?.querySelectorAll(".contact-reveal") ?? [];
      if (revealEls.length) {
        gsap.fromTo(
          revealEls,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: formCardRef.current, start: "top 78%", once: true },
          }
        );
      }

      // ── 8. Social links stagger ────────────────────────────────────────────
      const socials = socialRefs.current.filter(Boolean);
      if (socials.length) {
        gsap.fromTo(
          socials,
          { x: -14, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: infoCardRef.current, start: "top 78%", once: true },
          }
        );
      }

      // ── 9. Availability dot pulse loop ────────────────────────────────────
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 2.4, opacity: 0,
          duration: 1.2, ease: "power2.out",
          repeat: -1, repeatDelay: 0.6,
        });
      }

    }, sectionRef);

    // ── 10. Per-field focus accent underline draw ──────────────────────────
    const fields = sectionRef.current?.querySelectorAll<HTMLElement>(".contact-field-wrap");
    const cleanups: (() => void)[] = [];

    fields?.forEach((wrap) => {
      const input = wrap.querySelector<HTMLElement>("input, textarea");
      const bar   = wrap.querySelector<HTMLElement>(".contact-field-bar");
      if (!input || !bar) return;

      const onFocus = () =>
        gsap.to(bar, { scaleX: 1, duration: 0.3, ease: "power3.out" });
      const onBlur  = () =>
        gsap.to(bar, { scaleX: 0, duration: 0.25, ease: "power2.in" });

      input.addEventListener("focus", onFocus);
      input.addEventListener("blur",  onBlur);
      cleanups.push(() => {
        input.removeEventListener("focus", onFocus);
        input.removeEventListener("blur",  onBlur);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent! I'll reply soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)]"
    >
      {/* ── Watermark ── */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-[var(--section-pad)] -left-2 font-[var(--font-heading)] font-bold leading-none text-[var(--border)] opacity-[0.07] text-[clamp(80px,14vw,200px)] z-0"
      >
        CONTACT
      </span>

      <div className="relative z-10">

        {/* ── Header ── */}
        <span
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block"
        >
          // Contact
        </span>

        <h2
          ref={h2Ref}
          className="text-[clamp(48px,7vw,100px)] font-bold tracking-[-0.04em] leading-[1.0] mb-[clamp(40px,5vh,72px)] font-[var(--font-heading)]"
        >
          Get In Touch
        </h2>

        {/* Animated separator */}
        <div className="relative h-px bg-[var(--border)] overflow-hidden mb-[clamp(48px,6vh,80px)]">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-[var(--accent)] origin-left"
          />
        </div>

        {/* ── 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[1px] bg-[var(--border)] border border-[var(--border)]">

          {/* ── Form Card ── */}
          <Card
            ref={formCardRef}
            className="rounded-none border-0 ring-0 bg-[var(--bg-surface)] p-0 gap-0"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
              <div className="absolute inset-0 bg-[var(--accent)] origin-left scale-x-100" />
            </div>

            <CardHeader className="rounded-none px-8 pt-8 pb-0">
              <Badge
                variant="outline"
                className="rounded-none font-mono text-[9px] tracking-[0.12em] bg-transparent border-[var(--border-strong)] text-[var(--text-muted)] w-fit"
              >
                Send Message
              </Badge>
            </CardHeader>

            <CardContent className="px-8 pt-6 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FieldWrap label="Full Name" error={errors.name?.message}>
                    <Input {...register("name")} placeholder="John Doe" className={`${INPUT_CLASS} contact-reveal`} />
                  </FieldWrap>
                  <FieldWrap label="Email Address" error={errors.email?.message}>
                    <Input {...register("email")} type="email" placeholder="you@example.com" className={`${INPUT_CLASS} contact-reveal`} />
                  </FieldWrap>
                </div>

                {/* Subject */}
                <FieldWrap label="Subject" error={errors.subject?.message}>
                  <Input {...register("subject")} placeholder="Project inquiry" className={`${INPUT_CLASS} contact-reveal`} />
                </FieldWrap>

                {/* Message */}
                <FieldWrap label="Message" error={errors.message?.message}>
                  <Textarea
                    {...register("message")}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="rounded-none border-0 border-b border-[var(--border)] bg-transparent px-0 resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-0 focus-visible:border-[var(--accent)] transition-colors duration-200 contact-reveal"
                  />
                </FieldWrap>

                <div className="contact-reveal">
                  <SpinButton
                    type="submit"
                    label={submitting ? "Sending..." : "Send Message"}
                    disabled={submitting}
                    className="w-full justify-center"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ── Info Card ── */}
          <Card
            ref={infoCardRef}
            className="rounded-none border-0 ring-0 bg-[var(--bg-surface)] p-0 gap-0 flex flex-col"
          >
            <CardHeader className="rounded-none px-8 pt-8 pb-0">
              {/* Availability badge + pulse */}
              <div className="flex items-center gap-3">
                <div className="relative w-[6px] h-[6px] shrink-0">
                  <span className="absolute inset-0 rounded-full bg-[#22c55e]" />
                  <span
                    ref={dotRef}
                    className="absolute inset-0 rounded-full bg-[#22c55e] scale-100"
                  />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-none font-mono text-[9px] tracking-[0.12em] bg-transparent border-[var(--border-strong)] text-[#22c55e]"
                >
                  Available for Work
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-8 pt-6 pb-0 flex-1 flex flex-col gap-6">

              {/* Bio snippet */}
              <p className="text-[13px] leading-[1.75] text-[var(--text-muted)]">
                {personal.bio}
              </p>

              <Separator className="bg-[var(--border)]" />

              {/* Social links */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--border-strong)]">
                  Find Me Online
                </span>

                <TooltipProvider>
                  <div className="flex flex-col gap-3">
                    {[
                      { href: personal.github,   label: "GitHub",   tooltip: "Visit GitHub profile" },
                      { href: personal.linkedin, label: "LinkedIn", tooltip: "Visit LinkedIn profile" },
                    ].map((link, i) => (
                      <Tooltip key={link.label}>
                        <TooltipTrigger className="w-fit p-0 bg-transparent border-none">
                          <a
                            ref={(el) => { socialRefs.current[i] = el; }}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 no-underline"
                            data-cursor="link"
                          >
                            <span className="font-bold text-[18px] tracking-[-0.02em]">
                              {link.label}
                            </span>
                            <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              ↗
                            </span>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-none font-mono text-[10px] tracking-[0.08em] bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border)]">
                          {link.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>

            <CardFooter className="rounded-none border-t border-[var(--border)] bg-transparent px-8 py-4 mt-auto">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--border-strong)]">
                {personal.location} · Open to Remote
              </span>
            </CardFooter>
          </Card>

        </div>

        {/* ── Footer note ── */}
        <div className="mt-[clamp(32px,4vh,56px)] flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--border-strong)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--border-strong)]">
            Replies within 24 hours · All messages welcome
          </p>
        </div>

      </div>
    </section>
  );
}

// ── Field wrapper sub-component ───────────────────────────────────────────────

function FieldWrap({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="contact-field-wrap space-y-1 relative">
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--border-strong)] block">
        {label}
      </span>
      {children}
      {/* GSAP-driven accent underline (scaleX 0→1 on focus) */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
        <div className="contact-field-bar absolute inset-0 bg-[var(--accent)] origin-left scale-x-0" />
      </div>
      {error && (
        <p className="font-mono text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}
