"use client";

import { motion } from "framer-motion";
import { Database, Code, PaintBrush, TerminalWindow } from "@phosphor-icons/react";
import { TextReveal } from "../ui/TextReveal";

import TiltCard from "../ui/TiltCard";

const bentoItems = [
  {
    title: "Frontend Development",
    icon: <Code size={32} weight="duotone" className="text-amber-500" />,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    colSpan: "md:col-span-2",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Backend Systems",
    icon: <TerminalWindow size={32} weight="duotone" className="text-amber-500" />,
    skills: ["Node.js", "Express", "Python", "REST APIs"],
    colSpan: "md:col-span-1",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Database & Cloud",
    icon: <Database size={32} weight="duotone" className="text-amber-500" />,
    skills: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel"],
    colSpan: "md:col-span-1",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Creative Coding",
    icon: <PaintBrush size={32} weight="duotone" className="text-amber-500" />,
    skills: ["Three.js", "React Three Fiber", "WebGL", "GSAP"],
    colSpan: "md:col-span-2",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-16 md:py-24 w-full px-6 lg:px-12 bg-zinc-950 flex justify-center items-center relative z-20">
      <div className="max-w-[1000px] w-full mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-50">
            <TextReveal text="Technical Arsenal" />
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg text-base mx-auto md:mx-0">
            A comprehensive set of tools and technologies I use to build robust and beautiful digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {bentoItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={item.colSpan}
            >
              <TiltCard className="h-full group">
                <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 transition-all duration-300 h-full flex flex-col justify-between shadow-2xl group-hover:bg-zinc-800/60 group-hover:border-white/20" style={{ transformStyle: "preserve-3d" }}>
                  
                  <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="mb-6 p-3 rounded-2xl bg-zinc-950/80 inline-block border border-white/5 shadow-inner group-hover:border-amber-500/30 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-50 mb-3 tracking-tight">{item.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6 relative z-10" style={{ transform: "translateZ(40px)" }}>
                    {item.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-zinc-950 text-zinc-300 border border-white/5 group-hover:border-white/10 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
