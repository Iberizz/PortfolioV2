"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { STACK_ITEMS } from "@/lib/stack";

gsap.registerPlugin(ScrollTrigger);

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

const CX = 400;
const CY = 400;

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<SVGPathElement[]>([]);
  const satellitesRef = useRef<HTMLDivElement[]>([]);
  const hubRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
          [eyebrowRef.current, titleRef.current],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );

      tl.fromTo(
          hubRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.4"
      );

      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(
            line,
            { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" },
            `-=${i === 0 ? 0.2 : 0.4}`
        );
      });

      tl.fromTo(
          satellitesRef.current,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.08 },
          "-=0.8"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.to(".hub-ring", {
      scale: 1.3,
      opacity: 0,
      duration: 1.8,
      ease: "power2.out",
      repeat: -1,
      stagger: 0.6,
    });
  }, []);

  return (
      <section
          ref={sectionRef}
          id="stack"
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg py-32"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[20vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
          STACK
        </p>

        <div className="relative z-10 text-center mb-16">
          <div ref={eyebrowRef} className="flex items-center justify-center gap-3 mb-5 opacity-0">
            <div className="w-7 h-px bg-red-brand" />
            <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">
            Tech Stack
          </span>
            <div className="w-7 h-px bg-red-brand" />
          </div>
          <div ref={titleRef} className="opacity-0">
            <h2
                className="font-sans font-extrabold uppercase leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Tools I <span className="text-white/20">master</span>
            </h2>
          </div>
        </div>

        <div className="relative z-10" style={{ width: 800, height: 800 }}>
          <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 800"
          >
            {STACK_ITEMS.map((item, i) => {
              const x = CX + item.distance * Math.cos(toRad(item.angle));
              const y = CY + item.distance * Math.sin(toRad(item.angle));
              const mx = (CX + x) / 2;
              const my = (CY + y) / 2 - 30;
              return (
                  <path
                      key={item.name}
                      ref={(el) => { if (el) linesRef.current[i] = el; }}
                      d={`M ${CX} ${CY} Q ${mx} ${my} ${x} ${y}`}
                      stroke={hoveredItem === item.name ? item.color : "rgba(192,57,43,0.35)"}
                      strokeWidth={hoveredItem === item.name ? 1.5 : 0.8}
                      fill="none"
                      style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                  />
              );
            })}
          </svg>

          <div
              ref={hubRef}
              className="absolute opacity-0"
              style={{ left: CX - 48, top: CY - 48, width: 96, height: 96 }}
          >
            {[1, 2, 3].map((r) => (
                <div
                    key={r}
                    className="hub-ring absolute inset-0 rounded-full border border-red-brand/30"
                />
            ))}
            <div className="relative w-full h-full rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <span className="font-sans font-extrabold text-white text-xl tracking-tight">N</span>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest uppercase text-white/30 whitespace-nowrap">
                Next.js 15
              </div>
            </div>
          </div>

          {STACK_ITEMS.map((item, i) => {
            const x = CX + item.distance * Math.cos(toRad(item.angle));
            const y = CY + item.distance * Math.sin(toRad(item.angle));
            const isHovered = hoveredItem === item.name;

            return (
                <motion.div
                    key={item.name}
                    ref={(el) => { if (el) satellitesRef.current[i] = el; }}
                    className="absolute opacity-0 cursor-pointer"
                    style={{ left: x - 32, top: y - 32, width: 64, height: 64 }}
                    onHoverStart={() => setHoveredItem(item.name)}
                    onHoverEnd={() => setHoveredItem(null)}
                    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {isHovered && (
                      <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded"
                          style={{
                            background: item.color + "22",
                            border: `1px solid ${item.color}44`,
                            color: item.color,
                          }}
                      >
                        {item.name} {item.version && `v${item.version}`}
                      </motion.div>
                  )}
                  <div
                      className="w-full h-full rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300"
                      style={{
                        background: isHovered ? item.color + "18" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isHovered ? item.color + "80" : "rgba(255,255,255,0.08)"}`,
                        color: isHovered ? item.color : "rgba(255,255,255,0.6)",
                        boxShadow: isHovered ? `0 0 24px ${item.color}33` : "none",
                      }}
                  >
                    {item.icon}
                  </div>
                </motion.div>
            );
          })}
        </div>
      </section>
  );
}