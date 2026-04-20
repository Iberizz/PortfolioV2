"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

const NAV_ITEMS = [
  { num: "01", label: "Work",    href: "projects" },
  { num: "02", label: "About",   href: "about"    },
  { num: "03", label: "Stack",   href: "stack"    },
  { num: "04", label: "Contact", href: "contact"  },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const isAnimating = useRef(false);

  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const line3 = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef  = useRef<HTMLDivElement>(null);
  const infoRef   = useRef<HTMLDivElement>(null);

  /* ── Lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ── Open ── */
  const openMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(true);

    const overlay = overlayRef.current!;
    gsap.set(overlay, { visibility: "visible", pointerEvents: "auto" });

    // Hamburger → X
    gsap.timeline({ onComplete: () => { isAnimating.current = false; } })
      .to(line2.current, { scaleX: 0, opacity: 0, duration: 0.18, ease: "power2.in" })
      .to(line1.current, { y: 7.5, rotate: 45,  duration: 0.3, ease: "power3.out" }, "-=0.08")
      .to(line3.current, { y: -7.5, rotate: -45, duration: 0.3, ease: "power3.out" }, "<");

    // Overlay fade-in
    gsap.fromTo(overlay,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );

    // Links stagger up
    gsap.fromTo(
      Array.from(linksRef.current?.children ?? []),
      { y: 80, opacity: 0, skewY: 3 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.85, ease: "power4.out", stagger: 0.09, delay: 0.12 }
    );

    // Bottom info
    gsap.fromTo(infoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.52 }
    );
  };

  /* ── Close ── */
  const closeMenu = (onDone?: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const overlay = overlayRef.current!;

    // X → Hamburger
    gsap.timeline({ onComplete: () => { isAnimating.current = false; setIsOpen(false); onDone?.(); } })
      .to([line1.current, line3.current], { y: 0, rotate: 0, duration: 0.28, ease: "power3.out" })
      .to(line2.current, { scaleX: 1, opacity: 1, duration: 0.18, ease: "power2.out" }, "-=0.1");

    // Links out
    gsap.to(Array.from(linksRef.current?.children ?? []),
      { y: -30, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.04 }
    );
    gsap.to(infoRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });

    // Overlay fade-out
    gsap.to(overlay, {
      opacity: 0, scale: 0.97, duration: 0.45, ease: "power3.in", delay: 0.18,
      onComplete: () => gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" }),
    });
  };

  /* ── Nav click: close then scroll ── */
  const handleNavClick = (sectionId: string) => {
    closeMenu(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      {/* ── Hamburger button — mobile only ── */}
      <button
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="md:hidden fixed top-[26px] right-6 z-[100] flex flex-col gap-[6px] p-2 group"
      >
        <span ref={line1} className="block w-[22px] h-[1.5px] bg-white group-hover:bg-red-brand transition-colors duration-200 origin-center" />
        <span ref={line2} className="block w-[22px] h-[1.5px] bg-white group-hover:bg-red-brand transition-colors duration-200 origin-center" />
        <span ref={line3} className="block w-[22px] h-[1.5px] bg-white group-hover:bg-red-brand transition-colors duration-200 origin-center" />
      </button>

      {/* ── Fullscreen overlay ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[90] flex flex-col bg-[#0a0a0a] overflow-hidden"
        style={{ visibility: "hidden", pointerEvents: "none", opacity: 0 }}
      >
        {/* Red left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-brand z-10" />

        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Ghost text */}
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[30vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
          MENU
        </p>

        {/* Nav links */}
        <nav ref={linksRef} className="relative z-10 flex flex-col flex-1 justify-center pl-10 pr-6">
          {NAV_ITEMS.map(({ num, label, href }) => (
            <div
              key={label}
              className="border-b border-white/[0.06] first:border-t first:border-white/[0.06] overflow-hidden"
            >
              <button
                onClick={() => handleNavClick(href)}
                className="group flex items-baseline gap-5 w-full py-6 text-left"
              >
                <span className="font-mono text-[11px] tracking-[0.3em] text-red-brand shrink-0 mb-1">
                  {num}
                </span>
                <span
                  className="font-sans font-black uppercase leading-none tracking-tight text-white group-hover:text-red-brand transition-colors duration-300"
                  style={{ fontSize: "clamp(44px, 13vw, 88px)" }}
                >
                  {label}
                </span>
                <span className="ml-auto font-mono text-[11px] text-white/15 self-center group-hover:text-red-brand/60 transition-colors duration-300 shrink-0">
                  →
                </span>
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom info */}
        <div ref={infoRef} className="relative z-10 pl-10 pr-6 pb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25 mb-1.5">
              Email
            </p>
            <a
              href="mailto:ibrahim.nimaga@icloud.com"
              className="font-mono text-[11px] text-white/40 hover:text-red-brand transition-colors duration-200"
            >
              ibrahim.nimaga@icloud.com
            </a>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25 mb-1.5">
              Base
            </p>
            <p className="font-mono text-[11px] text-white/40">Paris, France</p>
          </div>
        </div>
      </div>
    </>
  );
}
