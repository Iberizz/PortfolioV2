"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CircuitBoard() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate travelling dots on each path
            const dots = svgRef.current?.querySelectorAll(".travel-dot");
            const paths = svgRef.current?.querySelectorAll(".circuit-path");

            // Draw lines first
            paths?.forEach((path) => {
                const length = (path as SVGPathElement).getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    delay: 0.3,
                });
            });

            // Travelling dots — loop forever
            dots?.forEach((dot, i) => {
                const path = paths?.[i] as SVGPathElement;
                if (!path) return;
                const length = path.getTotalLength();

                gsap.to({ progress: 0 }, {
                    progress: 1,
                    duration: gsap.utils.random(2, 3.5),
                    ease: "none",
                    repeat: -1,
                    delay: gsap.utils.random(0, 2),
                    onUpdate: function () {
                        const p = path.getPointAtLength(this.targets()[0].progress * length);
                        gsap.set(dot, { attr: { cx: p.x, cy: p.y } });
                    },
                });
            });

            // Chip pulse rings
            gsap.to(".chip-ring", {
                scale: 1.15,
                opacity: 0,
                duration: 2,
                ease: "power2.out",
                repeat: -1,
                stagger: 0.5,
                transformOrigin: "center center",
            });

            // Connection dots pulse
            gsap.to(".conn-dot", {
                opacity: 0.2,
                duration: 1.2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: 0.3,
            });
        }, svgRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative w-full flex items-center justify-center">
            <svg
                ref={svgRef}
                viewBox="0 0 900 160"
                className="w-full max-w-4xl"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* ── LEFT SIDE CIRCUIT ── */}

                {/* Main horizontal left */}
                <path
                    className="circuit-path"
                    d="M 340 80 L 180 80"
                    stroke="rgba(192,57,43,0.4)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Branch top-left */}
                <path
                    className="circuit-path"
                    d="M 280 80 L 280 40 L 120 40"
                    stroke="rgba(192,57,43,0.25)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Branch bottom-left */}
                <path
                    className="circuit-path"
                    d="M 240 80 L 240 120 L 80 120"
                    stroke="rgba(192,57,43,0.25)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Secondary branch top */}
                <path
                    className="circuit-path"
                    d="M 180 40 L 180 20 L 60 20"
                    stroke="rgba(192,57,43,0.15)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Tiny branch */}
                <path
                    className="circuit-path"
                    d="M 140 120 L 140 140 L 40 140"
                    stroke="rgba(192,57,43,0.15)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* ── RIGHT SIDE CIRCUIT ── */}

                {/* Main horizontal right */}
                <path
                    className="circuit-path"
                    d="M 560 80 L 720 80"
                    stroke="rgba(192,57,43,0.4)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Branch top-right */}
                <path
                    className="circuit-path"
                    d="M 620 80 L 620 40 L 780 40"
                    stroke="rgba(192,57,43,0.25)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Branch bottom-right */}
                <path
                    className="circuit-path"
                    d="M 660 80 L 660 120 L 820 120"
                    stroke="rgba(192,57,43,0.25)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Secondary branch top */}
                <path
                    className="circuit-path"
                    d="M 720 40 L 720 20 L 840 20"
                    stroke="rgba(192,57,43,0.15)"
                    strokeWidth="1"
                    fill="none"
                />
                {/* Tiny branch */}
                <path
                    className="circuit-path"
                    d="M 760 120 L 760 140 L 860 140"
                    stroke="rgba(192,57,43,0.15)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* ── TRAVELLING DOTS ── */}
                {/* Left main */}
                <circle className="travel-dot" r="2.5" fill="#C0392B" opacity="0.9" cx="340" cy="80" />
                {/* Left top branch */}
                <circle className="travel-dot" r="2" fill="#C0392B" opacity="0.7" cx="280" cy="80" />
                {/* Left bottom branch */}
                <circle className="travel-dot" r="2" fill="#C0392B" opacity="0.7" cx="240" cy="80" />
                {/* Left secondary */}
                <circle className="travel-dot" r="1.5" fill="#C0392B" opacity="0.5" cx="180" cy="40" />
                {/* Left tiny */}
                <circle className="travel-dot" r="1.5" fill="#C0392B" opacity="0.5" cx="140" cy="120" />
                {/* Right main */}
                <circle className="travel-dot" r="2.5" fill="#C0392B" opacity="0.9" cx="560" cy="80" />
                {/* Right top branch */}
                <circle className="travel-dot" r="2" fill="#C0392B" opacity="0.7" cx="620" cy="80" />
                {/* Right bottom branch */}
                <circle className="travel-dot" r="2" fill="#C0392B" opacity="0.7" cx="660" cy="80" />
                {/* Right secondary */}
                <circle className="travel-dot" r="1.5" fill="#C0392B" opacity="0.5" cx="720" cy="40" />
                {/* Right tiny */}
                <circle className="travel-dot" r="1.5" fill="#C0392B" opacity="0.5" cx="760" cy="120" />

                {/* ── CONNECTION DOTS at endpoints ── */}
                <circle className="conn-dot" cx="120" cy="40" r="3" fill="#C0392B" opacity="0.8" />
                <circle className="conn-dot" cx="80" cy="120" r="3" fill="#C0392B" opacity="0.8" />
                <circle className="conn-dot" cx="60" cy="20" r="2" fill="#C0392B" opacity="0.5" />
                <circle className="conn-dot" cx="40" cy="140" r="2" fill="#C0392B" opacity="0.5" />
                <circle className="conn-dot" cx="180" cy="80" r="3" fill="#C0392B" opacity="0.8" />
                <circle className="conn-dot" cx="780" cy="40" r="3" fill="#C0392B" opacity="0.8" />
                <circle className="conn-dot" cx="820" cy="120" r="3" fill="#C0392B" opacity="0.8" />
                <circle className="conn-dot" cx="840" cy="20" r="2" fill="#C0392B" opacity="0.5" />
                <circle className="conn-dot" cx="860" cy="140" r="2" fill="#C0392B" opacity="0.5" />
                <circle className="conn-dot" cx="720" cy="80" r="3" fill="#C0392B" opacity="0.8" />

                {/* ── CHIP PINS (top & bottom) ── */}
                {[370, 390, 410, 430, 450, 470, 490, 510, 530].map((x, i) => (
                    <g key={i}>
                        <line x1={x} y1="52" x2={x} y2="38" stroke="rgba(192,57,43,0.3)" strokeWidth="1.5" />
                        <line x1={x} y1="108" x2={x} y2="122" stroke="rgba(192,57,43,0.3)" strokeWidth="1.5" />
                        <rect x={x - 2} y="34" width="4" height="4" fill="rgba(192,57,43,0.4)" />
                        <rect x={x - 2} y="122" width="4" height="4" fill="rgba(192,57,43,0.4)" />
                    </g>
                ))}

                {/* ── CHIP BODY ── */}
                {/* Pulse rings */}
                <rect
                    className="chip-ring"
                    x="328" y="40" width="244" height="80" rx="8"
                    fill="none"
                    stroke="rgba(192,57,43,0.2)"
                    strokeWidth="1"
                />
                <rect
                    className="chip-ring"
                    x="328" y="40" width="244" height="80" rx="8"
                    fill="none"
                    stroke="rgba(192,57,43,0.15)"
                    strokeWidth="1"
                />

                {/* Main chip */}
                <rect
                    x="340" y="52" width="220" height="56" rx="6"
                    fill="#111111"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                />

                {/* Chip inner glow */}
                <rect
                    x="340" y="52" width="220" height="56" rx="6"
                    fill="url(#chipGlow)"
                    opacity="0.4"
                />

                {/* Chip label */}
                <text
                    x="450" y="83"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.85)"
                    fontSize="13"
                    fontFamily="'Space Mono', monospace"
                    letterSpacing="3"
                >
                    MY STACK
                </text>

                {/* Chip corner dots */}
                <circle cx="350" cy="62" r="2" fill="rgba(192,57,43,0.4)" />
                <circle cx="550" cy="62" r="2" fill="rgba(192,57,43,0.4)" />
                <circle cx="350" cy="98" r="2" fill="rgba(192,57,43,0.4)" />
                <circle cx="550" cy="98" r="2" fill="rgba(192,57,43,0.4)" />

                {/* ── DEFS ── */}
                <defs>
                    <radialGradient id="chipGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#C0392B" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}