"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$@&?%";
const NAME     = "IBRAHIM NIMAGA";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function rnd() { return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]; }

export default function Loader() {
  const topRef      = useRef<HTMLDivElement>(null);
  const botRef      = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);

  const [visible, setVisible] = useState(true);
  // Initialize with the real name — deterministic on SSR & client (no hydration mismatch).
  // The scramble useEffect immediately randomizes all chars client-side.
  const [chars, setChars] = useState<string[]>(() => NAME.split(""));

  /* ── Session check + scroll lock ── */
  useEffect(() => {
    if (sessionStorage.getItem("loader_seen")) {
      setVisible(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Scramble glitch ── */
  useEffect(() => {
    if (!visible) return;
    // Immediately randomize all chars client-side (safe — runs after hydration)
    setChars(NAME.split("").map((c) => (c === " " ? " " : rnd())));

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    NAME.split("").forEach((char, i) => {
      if (char === " ") return;
      const t = setTimeout(() => {
        let n = 0;
        const max = 5 + Math.floor(i * 0.9);
        const iv = setInterval(() => {
          if (n >= max) {
            clearInterval(iv);
            setChars((prev) => { const a = [...prev]; a[i] = char; return a; });
          } else {
            setChars((prev) => { const a = [...prev]; a[i] = rnd(); return a; });
            n++;
          }
        }, 45);
        intervals.push(iv);
      }, 500 + i * 55);
      timeouts.push(t);
    });

    return () => { timeouts.forEach(clearTimeout); intervals.forEach(clearInterval); };
  }, [visible]);

  /* ── Subtitle fade ── */
  useEffect(() => {
    if (!visible || !subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.1 });
  }, [visible]);

  /* ── Progress counter + exit ── */
  useEffect(() => {
    if (!visible) return;

    const DELAY    = 1000;  // start at 1s
    const DURATION = 1300;  // finish at 2.3s

    const t = setTimeout(() => {
      const t0 = performance.now();
      let rafId: number;

      const tick = () => {
        const p = Math.min(100, Math.round(((performance.now() - t0) / DURATION) * 100));
        if (barRef.current)     barRef.current.style.width = `${p}%`;
        if (counterRef.current) counterRef.current.textContent = `${String(p).padStart(3, "0")}%`;

        if (p < 100) {
          rafId = requestAnimationFrame(tick);
        } else {
          /* ── EXIT: split screen ── */
          setTimeout(() => {
            gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = "";
                sessionStorage.setItem("loader_seen", "1");
                setVisible(false);
              },
            })
              .to(topRef.current, { yPercent: -100, duration: 0.62, ease: "power4.inOut" })
              .to(botRef.current, { yPercent:  100, duration: 0.62, ease: "power4.inOut" }, "<");
          }, 80);
        }
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, DELAY);

    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  /* Shared grain layer */
  const grain = (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: NOISE, backgroundSize: "180px 180px",
        opacity: 0.055, animation: "loader-grain 0.38s steps(2) infinite",
      }}
    />
  );

  /* Name JSX — identical in both halves, centered in a 100vh frame */
  const nameEl = (
    <h1
      style={{
        fontFamily: "var(--font-syne)",
        fontSize: "clamp(32px, 8vw, 108px)",
        fontWeight: 900,
        letterSpacing: "-0.03em",
        color: "#fff",
        lineHeight: 1,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: c === NAME[i] ? "#fff" : "rgba(255,255,255,0.4)",
            minWidth: c === " " ? "0.35em" : undefined,
            transition: c === NAME[i] ? "color 0.08s" : "none",
          }}
        >
          {c}
        </span>
      ))}
    </h1>
  );

  /* Frame: 100vh content container; same position in both halves so
     clip at 50vh creates a perfect seamless split */
  const frame = (extraChildren?: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, right: 0, height: "100vh" }}>
      {/* Centered at viewport mid */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {nameEl}
      </div>
      {extraChildren}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes loader-grain {
          0%   { background-position: 0 0; }
          25%  { background-position: -8% -6%; }
          50%  { background-position: 6% 10%; }
          75%  { background-position: -11% 4%; }
          100% { background-position: 0 0; }
        }
      `}</style>

      {/* ── TOP HALF ── */}
      <div
        ref={topRef}
        style={{
          position: "fixed", zIndex: 9999,
          top: 0, left: 0, right: 0, height: "50vh",
          background: "#0a0a0a", overflow: "hidden",
        }}
      >
        {grain}
        {/* frame top:0 → name centered at 50vh, clip at 50vh shows top portion */}
        {frame()}
      </div>

      {/* ── BOTTOM HALF ── */}
      <div
        ref={botRef}
        style={{
          position: "fixed", zIndex: 9999,
          top: "50vh", left: 0, right: 0, height: "50vh",
          background: "#0a0a0a", overflow: "hidden",
        }}
      >
        {grain}
        {/*
          frame top:-50vh → content starts 50vh above bottom-half top edge,
          so name is at the same absolute position as in top half.
          Clip at bottom-half top = 50vh → reveals bottom portion.
        */}
        <div style={{ position: "absolute", top: "-50vh", left: 0, right: 0, height: "100vh" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {nameEl}
            {/* Subtitle — at 50vh + 3rem, visible only below the 50vh clip */}
            <div
              ref={subtitleRef}
              style={{
                marginTop: "1.25rem",
                fontFamily: "var(--font-space-mono)",
                fontSize: "11px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#C0392B",
                opacity: 0,
              }}
            >
              Software Engineer — Paris
            </div>
          </div>
        </div>

        {/* Progress counter */}
        <div
          style={{
            position: "absolute", bottom: 24, right: 24,
            fontFamily: "var(--font-space-mono)",
            fontSize: "11px", letterSpacing: "0.2em",
            color: "#C0392B",
          }}
        >
          <span ref={counterRef}>000%</span>
        </div>

        {/* Progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.05)" }}>
          <div ref={barRef} style={{ height: "100%", background: "#C0392B", width: "0%" }} />
        </div>
      </div>
    </>
  );
}
