"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { STACK_ITEMS, HUB } from "@/lib/stack";
import type { StackItem } from "@/types/stacks";

gsap.registerPlugin(ScrollTrigger);

function toRad(deg: number) { return (deg * Math.PI) / 180; }

const CX = 400;
const CY = 400;

/* ─── Logo / text icon ─── */
function NodeIcon({ icon, logoUrl, invertLogo, color, size = 32 }: {
  icon: string; logoUrl?: string; invertLogo?: boolean; color: string; size?: number;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl} alt={icon} width={size} height={size}
        style={{ width: size, height: size, objectFit: "contain", filter: invertLogo ? "invert(1)" : undefined, userSelect: "none", pointerEvents: "none" }}
        draggable={false}
      />
    );
  }
  return <span className="font-mono font-black text-xs tracking-tight leading-none" style={{ color }}>{icon}</span>;
}

/* ─── Detail card ─── */
function DetailCard({ item, onRight }: { item: StackItem; onRight: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute z-30 pointer-events-none"
      style={{
        ...(onRight ? { left: 72 } : { right: 72 }),
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div
        style={{
          minWidth: 180,
          background: "rgba(8,8,8,0.97)",
          border: `1px solid ${item.color}50`,
          backdropFilter: "blur(12px)",
        }}
        className="px-4 py-3"
      >
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="font-mono font-black text-[13px]" style={{ color: item.color }}>
            {item.name}
          </span>
          {item.version && (
            <span className="font-mono text-[9px] tracking-widest text-white/25">v{item.version}</span>
          )}
        </div>
        <p className="font-mono text-[10px] leading-[1.75] text-white/45 whitespace-normal" style={{ maxWidth: 190 }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Stack() {
  const sectionRef    = useRef<HTMLElement>(null);
  const circuit3dRef  = useRef<HTMLDivElement>(null);   // GSAP 3D rotation target
  const linesRef      = useRef<SVGPathElement[]>([]);
  const satellitesRef = useRef<HTMLDivElement[]>([]);
  const flashRefs     = useRef<HTMLDivElement[]>([]);   // power-on flash per node
  const hubRef        = useRef<HTMLDivElement>(null);
  const hubFlashRef   = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);

  const [hoveredItem, setHoveredItem] = useState<StackItem | null>(null);
  const [scale, setScale]             = useState(1);
  const [isMobile, setIsMobile]       = useState(false);

  /* ── Responsive scale ── */
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setScale(Math.min(1, w / 860));
      setIsMobile(w < 768);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  /* ── BOOT SEQUENCE ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
      });

      // Header
      tl.fromTo(
        [eyebrowRef.current, titleRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );

      // Hub power-on
      tl.fromTo(
        hubRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
        "-=0.3"
      );
      tl.fromTo(
        hubFlashRef.current,
        { opacity: 0.9 },
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        "<+0.04"
      );

      // Circuit lines draw (stroke-dashoffset)
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(line, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, `-=${i === 0 ? 0.1 : 0.38}`);
      });

      // Satellites power-on — stagger 0.15s, each gets a white flash
      satellitesRef.current.forEach((sat, i) => {
        if (!sat) return;
        tl.fromTo(
          sat,
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.5)" },
          `-=${i === 0 ? 0.35 : 0.25}`
        );
        const flash = flashRefs.current[i];
        if (flash) {
          gsap.set(flash, { opacity: 0.9 });
          tl.to(flash, { opacity: 0, duration: 0.38, ease: "power2.out" }, "<+0.04");
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Hub rings pulse ── */
  useEffect(() => {
    gsap.to(".hub-ring", { scale: 1.3, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1, stagger: 0.6 });
  }, []);

  /* ── PARALLAX 3D ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isMobile || !sectionRef.current || !circuit3dRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;   // -1 → 1
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    gsap.to(circuit3dRef.current, {
      rotateX: ny * -8,
      rotateY: nx * 8,
      duration: 0.9,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [isMobile]);

  const handleSectionEnter = useCallback(() => {
    if (isMobile || !circuit3dRef.current) return;
    gsap.to(circuit3dRef.current, { scale: 1.04, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  }, [isMobile]);

  const handleSectionLeave = useCallback(() => {
    if (!circuit3dRef.current) return;
    gsap.to(circuit3dRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    setHoveredItem(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleSectionEnter}
      onMouseLeave={handleSectionLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg py-32"
    >
      {/* Red edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

      {/* Ghost text */}
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[20vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
        STACK
      </p>

      {/* Header */}
      <div className="relative z-10 text-center mb-16">
        <div ref={eyebrowRef} className="flex items-center justify-center gap-3 mb-5 opacity-0">
          <div className="w-7 h-px bg-red-brand" />
          <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">Tech Stack</span>
          <div className="w-7 h-px bg-red-brand" />
        </div>
        <div ref={titleRef} className="opacity-0">
          <h2 className="font-sans font-extrabold uppercase leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Tools I <span className="text-white/20">master</span>
          </h2>
        </div>
      </div>

      {/* ── Circuit board ── */}
      {/* Outer: defines layout footprint */}
      <div className="relative z-10" style={{ width: 800 * scale, height: 800 * scale }}>
        {/* Perspective provider */}
        <div style={{ perspective: "1200px", width: "100%", height: "100%" }}>
          {/* 3D rotation + section-scale target (GSAP) */}
          <div
            ref={circuit3dRef}
            style={{ width: "100%", height: "100%", willChange: "transform" }}
          >
            {/* Responsive scale (CSS only — never touched by GSAP) */}
            <div style={{ width: 800, height: 800, transform: `scale(${scale})`, transformOrigin: "top left" }}>

              {/* SVG circuit lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 800">
                {STACK_ITEMS.map((item, i) => {
                  const x  = CX + item.distance * Math.cos(toRad(item.angle));
                  const y  = CY + item.distance * Math.sin(toRad(item.angle));
                  const mx = (CX + x) / 2;
                  const my = (CY + y) / 2 - 30;
                  const isActive  = hoveredItem?.name === item.name;
                  const isDimmed  = !!hoveredItem && !isActive;
                  return (
                    <path
                      key={item.name}
                      ref={(el) => { if (el) linesRef.current[i] = el; }}
                      d={`M ${CX} ${CY} Q ${mx} ${my} ${x} ${y}`}
                      stroke={isActive ? item.color : isDimmed ? "rgba(255,255,255,0.04)" : "rgba(192,57,43,0.35)"}
                      strokeWidth={isActive ? 2 : 0.8}
                      fill="none"
                      style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s", opacity: isDimmed ? 0.15 : 1 }}
                    />
                  );
                })}
              </svg>

              {/* Hub — Next.js */}
              <div
                ref={hubRef}
                className="absolute opacity-0"
                style={{ left: CX - 48, top: CY - 48, width: 96, height: 96 }}
              >
                {[1, 2, 3].map((r) => (
                  <div key={r} className="hub-ring absolute inset-0 rounded-full border border-red-brand/30" />
                ))}
                <div className="relative w-full h-full rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center backdrop-blur-sm">
                  <NodeIcon icon="Next.js" logoUrl={HUB.logoUrl} invertLogo={HUB.invertLogo} color="#ffffff" size={36} />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest uppercase text-white/30 whitespace-nowrap">
                    Next.js {HUB.version}
                  </div>
                </div>
                {/* Hub power-on flash */}
                <div
                  ref={hubFlashRef}
                  className="absolute inset-0 rounded-xl bg-white z-20 pointer-events-none"
                  style={{ opacity: 0 }}
                />
              </div>

              {/* Satellites */}
              {STACK_ITEMS.map((item, i) => {
                const x = CX + item.distance * Math.cos(toRad(item.angle));
                const y = CY + item.distance * Math.sin(toRad(item.angle));
                const isHovered = hoveredItem?.name === item.name;
                const isDimmed  = !!hoveredItem && !isHovered;
                const cardOnRight = x <= CX; // node on left half → card appears to the right

                return (
                  /* Outer wrapper: handles dimming opacity (CSS, no GSAP conflict) */
                  <div
                    key={item.name}
                    className="absolute"
                    style={{
                      left: x - 32, top: y - 32, width: 64, height: 64,
                      opacity: isDimmed ? 0.12 : 1,
                      transition: "opacity 0.35s ease",
                      zIndex: isHovered ? 20 : 1,
                    }}
                  >
                    {/* GSAP boot target + Framer scale */}
                    <motion.div
                      ref={(el) => { if (el) satellitesRef.current[i] = el; }}
                      className="absolute w-full h-full cursor-pointer opacity-0"
                      style={{ top: 0, left: 0 }}
                      onHoverStart={() => setHoveredItem(item)}
                      onHoverEnd={() => setHoveredItem(null)}
                      animate={{ scale: isHovered ? 1.25 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      {/* Power-on flash overlay */}
                      <div
                        ref={(el) => { if (el) flashRefs.current[i] = el; }}
                        className="absolute inset-0 rounded-xl bg-white z-10 pointer-events-none"
                        style={{ opacity: 0 }}
                      />

                      {/* Pulse ring on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            key="pulse"
                            initial={{ scale: 1, opacity: 0.7 }}
                            animate={{ scale: 2.3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.95, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ border: `1.5px solid ${item.color}` }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Node body */}
                      <div
                        className="w-full h-full rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{
                          background: isHovered ? item.color + "18" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isHovered ? item.color + "80" : "rgba(255,255,255,0.08)"}`,
                          boxShadow: isHovered ? `0 0 28px ${item.color}44` : "none",
                        }}
                      >
                        <NodeIcon icon={item.icon} logoUrl={item.logoUrl} invertLogo={item.invertLogo} color={item.color} size={28} />
                      </div>
                    </motion.div>

                    {/* Detail card */}
                    <AnimatePresence>
                      {isHovered && <DetailCard item={item} onRight={cardOnRight} />}
                    </AnimatePresence>
                  </div>
                );
              })}

            </div>{/* /scale-div */}
          </div>{/* /circuit3dRef */}
        </div>{/* /perspective */}
      </div>{/* /layout */}
    </section>
  );
}
