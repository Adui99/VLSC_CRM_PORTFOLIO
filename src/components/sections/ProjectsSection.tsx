"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useRef } from "react";
import { TextReveal } from "../ui/TextReveal";

const projects = [
  {
    id: 1,
    title: "Aether Dynamics",
    category: "WebGL Experience",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
  {
    id: 2,
    title: "Nova Interface",
    category: "UX/UI System",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    id: 3,
    title: "Chronos",
    category: "Motion Identity",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    id: 4,
    title: "Solaris Engine",
    category: "Data Visualization",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section id="projects" ref={containerRef} className="py-24 md:py-32 px-4 md:px-12 z-10 relative bg-zinc-950">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            <TextReveal text="SELECTED WORKS" />
          </h2>
          <p className="text-zinc-500 max-w-[65ch]">
            A curated collection of digital experiences blending aesthetic precision with technical rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const yTransform = i % 2 === 0 ? y1 : y2;
            return (
              <motion.div
                key={project.id}
                style={{ y: yTransform }}
                whileHover="hover"
                className={`relative group ${project.colSpan} h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800`}
              >
                {/* Image */}
                <motion.div
                  variants={{
                    hover: { scale: 1.05 }
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" />
                </motion.div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">
                        {project.category}
                      </p>
                      <h3 className="text-3xl font-bold tracking-tight text-zinc-50">
                        {project.title}
                      </h3>
                    </div>
                    
                    <motion.div
                      variants={{
                        hover: { scale: 1.1, rotate: 45, backgroundColor: "#ffb703", color: "#09090b" }
                      }}
                      className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900/50 backdrop-blur-md"
                    >
                      <ArrowUpRight size={20} weight="bold" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
