"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import type { Project } from "@/types/projects";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col border border-white/[0.07] hover:border-red-brand/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(192,57,43,0.12)]">
      {/* Screenshot */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-7 gap-5 bg-white/[0.015] group-hover:bg-white/[0.03] transition-colors duration-500">
        {/* Title row + Visit Site */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans font-extrabold uppercase tracking-tight text-white leading-none" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
            {project.title}
          </h3>
          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-red-brand transition-colors duration-200 whitespace-nowrap shrink-0 mt-1"
          >
            Visit Site →
          </a>
        </div>

        {/* Description */}
        <p className="font-mono text-xs leading-[1.9] text-white/40">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-2 border border-white/10 text-white/35 hover:border-red-brand/50 hover:text-white/60 transition-all duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-auto pt-5 border-t border-white/[0.06]">
          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex items-center gap-3 border border-white/20 px-6 py-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white hover:border-red-brand hover:bg-red-brand/10 transition-all duration-300"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-red-brand animate-pulse" />
            View Project
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25 hover:text-white/60 transition-colors duration-200"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
          subtitleRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          gridRef.current?.children ?? [],
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen overflow-hidden bg-bg py-32"
    >
      {/* Red edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-brand z-10" />

      {/* Ghost text */}
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-extrabold text-[18vw] uppercase leading-none tracking-tighter text-white/[0.025] pointer-events-none select-none whitespace-nowrap">
        WORK
      </p>

      {/* Grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 w-full px-14">
        {/* Header */}
        <div className="mb-16">
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-7 opacity-0">
            <div className="w-7 h-px bg-red-brand" />
            <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-red-brand">
              Projects
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-sans font-extrabold uppercase leading-[0.9] tracking-tight text-white mb-6 opacity-0"
            style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
          >
            Selected <span className="text-white/20">Work</span>
          </h2>

          <p
            ref={subtitleRef}
            className="font-mono text-sm leading-[1.8] text-white/40 max-w-[480px] opacity-0"
          >
            Un aperçu de mes projets récents — des interfaces qui pensent, scalent et convertissent.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-14 right-14 h-px bg-white/[0.06]" />
    </section>
  );
}
