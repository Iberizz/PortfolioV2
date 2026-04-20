import { Project } from "@/types/projects";

export const projects: Project[] = [
  {
    id: 1,
    title: "Berizz Auto",
    description: "Configurateur de voitures premium avec interface immersive et expérience utilisateur haut de gamme.",
    image: "/projects/berizz-auto.png",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    siteUrl: "https://berizz-auto.vercel.app",
    githubUrl: "https://github.com/Iberizz/berizz-auto"
  },
  {
    id: 2,
    title: "Maison Ora",
    description: "Site vitrine pour restaurant gastronomique, pensé pour convertir et refléter l'identité de la maison.",
    image: "/projects/maison-ora.png",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    siteUrl: "https://maison-ora.vercel.app",
    githubUrl: "https://github.com/Iberizz/maison-ora"
  },
  {
    id: 3,
    title: "Job Tracker",
    description: "Dashboard de suivi de candidatures pour optimiser et centraliser sa recherche d'emploi.",
    image: "/projects/tracker.png",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    siteUrl: "https://berizz-jobtracker.vercel.app",
    githubUrl: "https://github.com/Iberizz/tracker"

  },
  {
    id: 4,
    title: "Startup Landing",
    description: "Landing page moderne pour startup SaaS, optimisée pour la conversion et l'acquisition.",
    image: "/projects/startup.png",
    tags: ["React", "Vite", "TypeScript", "Tailwind"],
    siteUrl: "#",
    githubUrl: "https://github.com/Iberizz/startup"
  },
];