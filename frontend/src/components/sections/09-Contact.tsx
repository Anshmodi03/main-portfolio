"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SpinButton from "@/components/ui/SpinButton";
import { Separator } from "@/components/ui/separator";
import { personal } from "@/lib/data";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const INPUT_CLASS =
  "rounded-none border-0 border-b border-[var(--border)] bg-transparent px-0 h-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-0 focus-visible:border-[var(--accent)] transition-colors";

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const h2Ref       = useRef<HTMLHeadingElement>(null);
  const emailRef    = useRef<HTMLAnchorElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Giant heading SplitText reveal
      if (h2Ref.current) {
        const split = new SplitText(h2Ref.current, { type: "lines" });
        gsap.fromTo(
          split.lines,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: h2Ref.current, start: "top 85%" },
            onComplete: () => split.revert() }
        );
      }

      // Email link fade-up
      gsap.fromTo(
        emailRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: emailRef.current, start: "top 85%" } }
      );

      // Bottom two-col stagger
      gsap.fromTo(
        bottomRef.current?.querySelectorAll(".contact-animate") ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: bottomRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
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
      className="relative overflow-hidden bg-[var(--bg-base)] py-[var(--section-pad)] px-[var(--gutter)] min-h-[80vh] flex flex-col justify-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] mb-6 block">
        // Contact
      </p>

      {/* Giant heading */}
      <h2
        ref={h2Ref}
        className="text-[clamp(56px,9vw,128px)] font-bold tracking-[-0.05em] leading-[0.9] mb-8 font-[var(--font-heading)]"
      >
        LET&apos;S TALK<span className="text-[var(--accent)]"> →</span>
      </h2>

      {/* Big email link */}
      <a
        ref={emailRef}
        href={`mailto:${personal.email}`}
        className="block text-[clamp(20px,3.5vw,48px)] font-bold tracking-[-0.03em] leading-none text-[var(--text-primary)] no-underline hover:text-[var(--accent)] transition-colors duration-300 mb-16"
        data-cursor="link"
      >
        {personal.email}
      </a>

      <Separator className="bg-[var(--border)] mb-16" />

      {/* Bottom two-col */}
      <div
        ref={bottomRef}
        className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-[clamp(40px,6vw,100px)] items-start"
      >
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="contact-animate space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input {...register("name")} placeholder="Full Name" className={INPUT_CLASS} />
              {errors.name && (
                <p className="font-mono text-[10px] text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input {...register("email")} type="email" placeholder="Email Address" className={INPUT_CLASS} />
              {errors.email && (
                <p className="font-mono text-[10px] text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Input {...register("subject")} placeholder="Subject" className={INPUT_CLASS} />
            {errors.subject && (
              <p className="font-mono text-[10px] text-red-400">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Textarea
              {...register("message")}
              placeholder="Your Message"
              rows={5}
              className="rounded-none border-0 border-b border-[var(--border)] bg-transparent px-0 resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-0 focus-visible:border-[var(--accent)] transition-colors"
            />
            {errors.message && (
              <p className="font-mono text-[10px] text-red-400">{errors.message.message}</p>
            )}
          </div>

          <SpinButton
            type="submit"
            label={submitting ? "Sending..." : "Send Message"}
            disabled={submitting}
            className="w-full justify-center"
          />
        </form>

        {/* Social column */}
        <div className="contact-animate flex flex-col gap-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">
              Socials
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold tracking-[-0.02em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors duration-200"
                data-cursor="link"
              >
                GitHub ↗
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold tracking-[-0.02em] text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors duration-200"
                data-cursor="link"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#22c55e] flex items-center gap-2">
            <span>●</span> Available for work
          </p>
        </div>
      </div>
    </section>
  );
}
