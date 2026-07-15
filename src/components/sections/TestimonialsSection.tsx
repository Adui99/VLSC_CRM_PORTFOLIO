"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quotes, Star } from "@phosphor-icons/react";
import { TextReveal } from "../ui/TextReveal";

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Alex Sterling",
    role: "CEO at NovaTech",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    text: "The sheer attention to detail and physics-based interactions blew our minds. It didn't just feel like a website, it felt like a living digital space.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "Working with them was a seamless experience. They understand the intersection of motion and functionality better than anyone I've collaborated with.",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    role: "Founder, Aether Dynamics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "Our conversion rates skyrocketed after the redesign. The 3D elements weren't just a gimmick, they actually drove engagement and guided users perfectly.",
  },
  {
    id: 4,
    name: "Emily Watson",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    text: "Exceptional delivery time and flawless execution. The WebGL implementation is optimized so well that it runs butter smooth even on mobile devices.",
  },
];

// Duplicate the array to create a seamless infinite loop
const duplicatedTestimonials = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: false, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-4 md:px-12 z-10 relative bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1400px] mx-auto" ref={containerRef}>
        <motion.div 
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              <TextReveal text="CLIENT REVIEWS" />
            </h2>
            <p className="text-zinc-500 max-w-[65ch]">
              Don't just take my word for it. Here is what people I've collaborated with have to say about my work.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Gradient masks for smooth fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35, // Adjust this value to make it scroll faster or slower
            }}
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <div 
                key={`${testimonial.id}-${idx}`} 
                className="w-[320px] md:w-[420px] shrink-0"
              >
                <div className="h-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-8 md:p-10 rounded-[2rem] flex flex-col hover:bg-zinc-800/50 transition-colors duration-300">
                  <Quotes size={32} weight="fill" className="text-amber-500 mb-6 opacity-50" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} weight="fill" className="text-amber-500" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-10 flex-grow">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-zinc-800/50">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover grayscale opacity-80"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-50">{testimonial.name}</h4>
                      <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
