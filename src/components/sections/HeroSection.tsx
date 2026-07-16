"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "@phosphor-icons/react";
import MagneticButton from "../ui/MagneticButton";

import { TextReveal } from "../ui/TextReveal";
import Scene3D from "../3d/Scene3D";
import Terminal from "../ui/Terminal";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function HeroSection() {
  const { isLoading } = useLoadingStore();

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-center px-4 md:px-12 z-10 overflow-hidden">
      {/* 3D Background - limited to Hero */}
      <Scene3D />
      
      <motion.div 
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-[1400px] mx-auto w-full relative z-10"
      >
        {/* Left Side: Typography */}
        <div className="flex flex-col items-start justify-center">
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="text-amber-500 font-mono tracking-widest uppercase mb-4 text-sm md:text-base"
          >
            Digital Experience Designer
          </motion.p>
          
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] font-bold mb-8"
          >
            <TextReveal text="CRAFTING" />
            <TextReveal text="IMMERSIVE" />
            <span className="text-amber-500"><TextReveal text="DIMENSIONS" /></span>
          </motion.h1>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <MagneticButton 
              className="bg-zinc-100 text-zinc-950 px-8 py-4 flex items-center gap-2 hover:bg-amber-500 hover:text-zinc-950 transition-colors font-medium rounded-full"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Selected Work
              <ArrowDownRight weight="bold" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Side: Terminal */}
        <div className="hidden md:flex justify-end items-center h-full">
           <motion.div
             variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
             }}
             className="relative w-full max-w-[500px]"
           >
             <Terminal />
           </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
