"use client";

import { motion } from "framer-motion";
import MagneticButton from "../ui/MagneticButton";
import { useModalStore } from "@/store/useModalStore";

export default function ContactSection() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <section id="contact" className="relative py-32 px-4 md:px-12 z-10 bg-zinc-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-8"
        >
          Let's collaborate
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none mb-12"
        >
          START A <br /> PROJECT
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          onClick={openModal}
        >
          <MagneticButton intensity={60} className="bg-amber-500 text-zinc-950 px-12 py-6 text-xl rounded-full hover:bg-zinc-50 transition-colors">
            hello@portfolio.com
          </MagneticButton>
        </motion.div>

        <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm border-t border-zinc-800/50 pt-8">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            {["Twitter", "LinkedIn", "GitHub", "Awwwards"].map((link) => (
              <a key={link} href="#" className="hover:text-zinc-50 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
