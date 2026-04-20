import { StackItem } from "@/types/stacks";

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const STACK_ITEMS: StackItem[] = [
  { name: "React",      version: "18", color: "#61DAFB", angle: 0,   distance: 200, icon: "React",  logoUrl: `${CDN}/react/react-original.svg`,           desc: "UI composants réactifs & state management" },
  { name: "TypeScript", version: "5",  color: "#3178C6", angle: 51,  distance: 210, icon: "TS",     logoUrl: `${CDN}/typescript/typescript-original.svg`,  desc: "Typage statique & developer experience" },
  { name: "Tailwind",   version: "3",  color: "#38BDF8", angle: 103, distance: 195, icon: "TW",     logoUrl: `${CDN}/tailwindcss/tailwindcss-original.svg`, desc: "Utility-first CSS, design system rapide" },
  { name: "GSAP",       version: "3",  color: "#88CE02", angle: 154, distance: 215, icon: "GSAP",                                                          desc: "Animations haute performance 60fps" },
  { name: "Figma",                     color: "#F24E1E", angle: 206, distance: 200, icon: "Figma",  logoUrl: `${CDN}/figma/figma-original.svg`,             desc: "Design & prototypage UI/UX" },
  { name: "Supabase",   version: "2",  color: "#3ECF8E", angle: 257, distance: 210, icon: "SB",     logoUrl: `${CDN}/supabase/supabase-original.svg`,       desc: "Backend as a Service, PostgreSQL temps réel" },
  { name: "Git",                       color: "#F05032", angle: 309, distance: 195, icon: "Git",    logoUrl: `${CDN}/git/git-original.svg`,                 desc: "Versioning & collaboration d'équipe" },
];

export const HUB = {
  name: "Next.js",
  version: "15",
  logoUrl: `${CDN}/nextjs/nextjs-original.svg`,
  invertLogo: true,
};
