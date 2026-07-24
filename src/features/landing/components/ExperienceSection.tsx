"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "../ui/TextReveal";

const experiences = [
  {
    year: "2024 - Present",
    role: "Senior Frontend Engineer",
    company: "Tech Innovators",
    description: "Lead the frontend team to build high-performance 3D web applications and interactive experiences.",
  },
  {
    year: "2022 - 2024",
    role: "UI/UX Designer & Developer",
    company: "Creative Studio",
    description: "Designed and developed award-winning Awwwards websites with smooth animations and interactions.",
  },
  {
    year: "2020 - 2022",
    role: "Frontend Developer",
    company: "Digital Agency",
    description: "Started building robust React applications and diving into the world of creative coding.",
  },
];

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <section id="experience" ref={containerRef} className="py-32 w-full max-w-7xl mx-auto px-6 lg:px-12 bg-transparent">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
          <TextReveal text="Experience" />
        </h2>
        <p className="text-zinc-400 mt-4 max-w-lg text-lg">
          My journey in the digital realm, crafting interfaces and pushing boundaries.
        </p>
      </div>

      <div className="relative">
        {/* Background Line */}
        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute left-[15px] md:left-1/2 top-0 w-[2px] bg-amber-500 -translate-x-1/2 origin-top"
          style={{ height: lineHeight }}
        />

        <div className="flex flex-col gap-12 md:gap-24">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col md:flex-row gap-8 items-start w-full relative z-10 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Node */}
                <div className="absolute left-[15px] md:left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-950 border-2 border-amber-500" />
                
                {/* Content */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="text-amber-500 font-medium mb-1">{exp.year}</div>
                  <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                  <h4 className="text-zinc-300 text-lg mb-3">{exp.company}</h4>
                  <p className="text-zinc-500 text-base">{exp.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
