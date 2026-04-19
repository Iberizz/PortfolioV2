"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import type { SectionTab } from "@/types";

const SECTION_TABS: SectionTab[] = [
  { num: "01", label: "Hero", active: true },
  { num: "02", label: "About" },
  { num: "03", label: "Projects" },
  { num: "04", label: "Stack" },
  { num: "05", label: "Contact" },
];

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    )
        .fromTo(
            [line1Ref.current, line2Ref.current, line3Ref.current],
            { y: 90, opacity: 0, skewY: 4 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "-=0.5"
        )
        .fromTo(
            subtitleRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
            "-=0.5"
        )
        .fromTo(
            ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        )
        .fromTo(
            scrollRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );
  }, []);

  useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 à 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 à 1
            setMouse({ x, y });
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, []);

  return (
      <section
          id="hero"
          className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg"
      >
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Red edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

        {/* Ghost watermark */}
        <p className="absolute right-[-10px] top-1/2 -translate-y-1/2 font-sans font-extrabold text-[22vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none z-0 whitespace-nowrap">
          IBRA
        </p>

        {/* Terrain glow bottom */}
        <div
            className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none z-0"
            style={{
              background:
                  "radial-gradient(ellipse 65% 55% at 58% 105%, rgba(192,57,43,0.13) 0%, transparent 70%)",
            }}
        />

          {/* Orbs — 3D mouse parallax */}
          <motion.div
              className="absolute right-[7%] top-1/2 -translate-y-[52%] z-[5] flex flex-col items-center"
              onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  setTilt({x, y});
              }}
              onMouseLeave={() => setTilt({x: 0, y: 0})}
              animate={{
                  rotateX: mouse.y * -16 + tilt.y * -40,
                  rotateY: mouse.x * 20 + tilt.x * 40,
              }}
              transition={{type: "spring", stiffness: 100, damping: 18}}
              style={{transformStyle: "preserve-3d", perspective: 600}}
          >
              {/* Dark main orb — bouge moins (couche loin) */}
              <motion.div
                  animate={{
                      y: mouse.y * -12,
                      x: mouse.x * -8,
                  }}
                  transition={{type: "spring", stiffness: 60, damping: 18}}
              >
                  <motion.div
                      animate={{y: [0, -18, 0]}}
                      transition={{duration: 4.5, repeat: Infinity, ease: "easeInOut"}}
                      className="relative w-52 h-52 rounded-full"
                      style={{
                          background: "radial-gradient(circle at 33% 28%, #252525, #080808 65%, #000)",
                          boxShadow: "inset 0 0 40px rgba(255,255,255,0.03), inset -12px -12px 30px rgba(0,0,0,0.9), 0 40px 100px rgba(0,0,0,0.95)",
                      }}
                  >
                      <div
                          className="absolute top-[16%] left-[20%] w-[36%] h-[22%] rounded-full bg-gradient-to-br from-white/10 to-transparent"/>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[10px]">
                          <div className="w-[13px] h-[36px] rounded-[3px] bg-red-brand opacity-90"/>
                          <div className="w-[13px] h-[36px] rounded-[3px] bg-red-brand opacity-90"/>
                      </div>
                  </motion.div>
              </motion.div>

              {/* Red orb — bouge plus vite (couche proche) */}
              <motion.div
                  animate={{
                      y: mouse.y * -22,
                      x: mouse.x * -16,
                  }}
                  transition={{type: "spring", stiffness: 50, damping: 15}}
                  className="-mt-6"
              >
                  <motion.div
                      animate={{y: [0, -11, 0]}}
                      transition={{duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6}}
                      className="relative w-28 h-28 rounded-full"
                      style={{
                          background: "radial-gradient(circle at 38% 32%, #e74c3c, #922b21 55%, #2d0a07)",
                          boxShadow: "0 0 70px rgba(192,57,43,0.65), 0 0 140px rgba(192,57,43,0.25), 0 24px 60px rgba(0,0,0,0.85)",
                      }}
                  >
                      <div
                          className="absolute top-[15%] left-[18%] w-[34%] h-[20%] rounded-full bg-gradient-to-br from-red-200/25 to-transparent"/>
                  </motion.div>
              </motion.div>
          </motion.div>

          {/* Content */}
          <div className="relative z-[6] px-14 pt-28 max-w-[60%]">
              {/* Eyebrow */}
              <div
                  ref={eyebrowRef}
                  className="flex items-center gap-3 mb-7 opacity-0"
              >
                  <div className="w-7 h-px bg-red-brand"/>
                  <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">
            Software Engineer — Paris
          </span>
              </div>

              {/* Headline */}
              <h1 className="font-sans font-extrabold uppercase leading-[0.88] tracking-tight mb-8">
          <span
              ref={line1Ref}
              className="block opacity-0 text-red-brand"
              style={{ fontSize: "clamp(48px, 7vw, 92px)" }}
          >
            Build Beyond
          </span>
            <span
                ref={line2Ref}
                className="block opacity-0 text-white"
                style={{ fontSize: "clamp(48px, 7vw, 92px)" }}
            >
            Limits.
          </span>
            <span
                ref={line3Ref}
                className="block opacity-0 text-white/[0.13]"
                style={{ fontSize: "clamp(48px, 7vw, 92px)" }}
            >
            Ibrahim Nimaga
          </span>
          </h1>

          {/* Subtitle */}
          <p
              ref={subtitleRef}
              className="font-mono text-sm leading-[1.8] text-white/40 max-w-[400px] mb-12 opacity-0"
          >
            Web products that don&apos;t just look stunning —{" "}
            <em className="not-italic text-white/80">think, scale,</em> and{" "}
            <em className="not-italic text-white/80">convert.</em>
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex items-center gap-8 opacity-0">
          <a
            href="#projects"
            className="group flex items-center gap-3 border border-white/20 px-7 py-4 font-mono text-[11px] tracking-[0.2em] uppercase text-white hover:border-red-brand hover:bg-red-brand/10 transition-all duration-300"
            >
            <span className="w-[7px] h-[7px] rounded-full bg-red-brand animate-pulse" />
            View my work
          </a>
            <a
          href="/cv.pdf"
          target="_blank"
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-white/60 transition-colors duration-200"
          >
          Download CV ↗
        </a>
      </div>
</div>

  {/* Scroll indicator */}
  <div
      ref={scrollRef}
      className="absolute bottom-16 left-14 flex items-center gap-4 z-10 opacity-0"
  >
    <div className="w-12 h-px bg-white/10" />
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
          Scroll to explore
        </span>
  </div>

  {/* GPS */}
  <div className="absolute bottom-16 right-14 text-right z-10">
    <p className="font-mono text-[9px] tracking-widest text-white/[0.12] leading-[1.9]">
      48°51&apos;N 2°21&apos;E
      <br />
      Paris, France
    </p>
  </div>

  {/* Section bar */}
  <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] flex z-10">
    {SECTION_TABS.map(({ num, label, active }) => (
        <div
            key={label}
            className={`flex-1 flex items-center gap-3 px-6 py-[14px] border-r border-white/[0.06] last:border-r-0 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] ${
                active
                    ? "border-t-[1.5px] border-t-red-brand bg-red-brand/[0.03]"
                    : ""
            }`}
        >
          <span className="font-mono text-[9px] text-red-brand/60">{num}</span>
          <span
              className={`font-mono text-[9px] tracking-[0.2em] uppercase ${
                  active ? "text-white/55" : "text-white/18"
              }`}
          >
              {label}
            </span>
        </div>
    ))}
  </div>
</section>
);
}