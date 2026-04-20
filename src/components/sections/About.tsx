"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS, BADGES } from "@/lib/about";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

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
              bioRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
              "-=0.5"
          )
          .fromTo(
              statsRef.current?.children ?? [],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
              "-=0.4"
          )
          .fromTo(
              badgesRef.current?.children ?? [],
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)", stagger: 0.06 },
              "-=0.3"
          );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
      <section
          ref={sectionRef}
          id="about"
          className="relative min-h-screen flex items-center overflow-hidden bg-bg py-32"
      >
        {/* Red edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

        {/* Ghost text */}
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[20vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
          ABOUT
        </p>

        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 w-full px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center">
          {/* LEFT — Bio */}
          <div>
            <div
                ref={eyebrowRef}
                className="flex items-center gap-3 mb-7 opacity-0"
            >
              <div className="w-7 h-px bg-red-brand" />
              <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">
              About me
            </span>
            </div>

            <h2
                ref={titleRef}
                className="font-sans font-extrabold uppercase leading-[0.9] tracking-tight text-white mb-10 opacity-0"
                style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
            >
              Who I <span className="text-white/20">Am</span>
            </h2>

            <div ref={bioRef} className="opacity-0 space-y-5">
              <p className="font-mono text-sm leading-[1.9] text-white/45">
                Je suis <em className="not-italic text-white/80">Ibrahim Nimaga</em>, Software Engineer basé à Paris. Je conçois et développe des expériences web modernes — du backend au pixel-perfect frontend.
              </p>
              <p className="font-mono text-sm leading-[1.9] text-white/45">
                Passionné par les interfaces qui <em className="not-italic text-white/80">pensent, scalent et convertissent</em>. J&apos;aime les projets qui challengent — ceux où l&apos;architecture compte autant que l&apos;esthétique.
              </p>
            </div>

            {/* Badges */}
            <div
                ref={badgesRef}
                className="flex flex-wrap gap-2 mt-10"
            >
              {BADGES.map(({ label }) => (
                  <span
                      key={label}
                      className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-2 border border-white/10 text-white/35 hover:border-red-brand/50 hover:text-white/60 transition-all duration-200"
                  >
                {label}
              </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Stats */}
          <div className="flex flex-col gap-0" ref={statsRef}>
            {STATS.map(({ value, label }, i) => (
                <div
                    key={label}
                    className={`py-7 px-4 md:py-10 md:px-8 border-t border-white/[0.07] last:border-b last:border-white/[0.07] group hover:bg-white/[0.02] transition-colors duration-300 opacity-0`}
                >
                  <div
                      className="font-sans font-extrabold text-white leading-none mb-3 group-hover:text-red-brand transition-colors duration-300"
                      style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
                  >
                    {value}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/30">
                    {label}
                  </div>
                  {i < STATS.length - 1 && (
                      <div className="absolute right-8 top-1/2 w-1 h-1 rounded-full bg-red-brand/40" />
                  )}
                </div>
            ))}
          </div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-14 right-14 h-px bg-white/[0.06]" />
      </section>
  );
}