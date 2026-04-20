"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

type Status = "idle" | "loading" | "success" | "error";

const CONTACT_ITEMS = [
  { label: "Email", value: "ibrahim.nimaga@icloud.com", href: "mailto:ibrahim.nimaga@icloud.com" },
  { label: "Localisation", value: "Paris, France", href: null },
  { label: "Disponibilité", value: "Ouvert aux opportunités", href: null },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          leftRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          formRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { name: fields.name, email: fields.email, message: fields.message },
        PUBLIC_KEY
      );
      setStatus("success");
      setFields({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border border-white/10 px-5 py-4 font-mono text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-red-brand/60 transition-colors duration-200";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen flex items-center overflow-hidden bg-bg py-32"
    >
      {/* Red edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

      {/* Ghost text */}
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[16vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
        CONTACT
      </p>

      {/* Grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 w-full px-14 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* LEFT */}
        <div>
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-7 opacity-0">
            <div className="w-7 h-px bg-red-brand" />
            <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">
              Contact
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-sans font-extrabold uppercase leading-[0.9] tracking-tight text-white mb-10 opacity-0"
            style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
          >
            Let&apos;s Work <span className="text-white/20">Together</span>
          </h2>

          <div ref={leftRef} className="opacity-0 space-y-10">
            <p className="font-mono text-sm leading-[1.9] text-white/45 max-w-sm">
              Disponible pour des projets freelance, des collaborations ou des postes en CDI. Parlons de ce que vous voulez construire.
            </p>

            <div className="flex flex-col gap-0">
              {CONTACT_ITEMS.map(({ label, value, href }) => (
                <div
                  key={label}
                  className="py-6 border-t border-white/[0.07] last:border-b last:border-white/[0.07] group"
                >
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-2">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="font-mono text-sm text-white/60 hover:text-red-brand transition-colors duration-200"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-mono text-sm text-white/60">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div ref={formRef} className="opacity-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={fields.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={fields.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <textarea
              name="message"
              placeholder="Décrivez votre projet..."
              rows={8}
              value={fields.message}
              onChange={handleChange}
              required
              className={`${inputClass} resize-none`}
            />

            {/* Feedback */}
            {status === "success" && (
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-red-brand">
                Message envoyé — je vous réponds sous 24h.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">
                Une erreur est survenue. Réessayez ou écrivez directement par email.
              </p>
            )}

            <div className="flex items-center gap-8 pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group flex items-center gap-3 border border-white/20 px-7 py-4 font-mono text-[11px] tracking-[0.2em] uppercase text-white hover:border-red-brand hover:bg-red-brand/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span
                  className={`w-[7px] h-[7px] rounded-full bg-red-brand ${
                    status === "loading" ? "animate-ping" : "animate-pulse"
                  }`}
                />
                {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
              </button>

              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/20">
                Réponse sous 24h
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-14 right-14 h-px bg-white/[0.06]" />
    </section>
  );
}
