"use client";

import { motion } from "framer-motion";
import AnimatedParagraph from "../ui/AnimatedParagraph";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 w-full px-6 lg:px-12 bg-zinc-950 flex justify-center items-center">
      <div className="max-w-[1000px] mx-auto text-center md:text-left">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-relaxed md:leading-normal text-zinc-400">
          <AnimatedParagraph 
            className="justify-center md:justify-start"
            segments={[
              { text: "I believe that digital spaces are not just functional tools, but" },
              { text: "architectural environments", className: "text-zinc-50" },
              { text: "that require" },
              { text: "spatial physics,", className: "text-amber-500" },
              { text: "precise typography, and" },
              { text: "immersive motion.", className: "text-zinc-50" }
            ]} 
          />
        </h2>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-800 pt-12">
          {[
            { label: "Design", value: "Framer / Figma" },
            { label: "Frontend", value: "Next.js / React" },
            { label: "Motion", value: "Framer Motion" },
            { label: "3D", value: "Three.js / R3F" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col items-start"
            >
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">{item.label}</span>
              <span className="text-zinc-100 font-medium">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
