"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import type { NavLink } from "@/types";
import MobileMenu from "./MobileMenu";

const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
      <>
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 py-7 border-b border-white/5 bg-bg/80 backdrop-blur-sm opacity-0"
        >
          <span className="font-mono text-sm tracking-widest">
            IN<span className="text-red-brand">.</span>
          </span>

          <div className="hidden md:flex gap-10">
            {NAV_LINKS.map(({ label, href }) => (
                <Link
                    key={label}
                    href={href}
                    className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
              Available
            </span>
          </div>
        </nav>

        <MobileMenu />
      </>
  );
}