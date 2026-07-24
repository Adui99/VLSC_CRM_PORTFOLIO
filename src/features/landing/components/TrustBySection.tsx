"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

// You can replace these with actual SVG logos
const logos = [
  "Acme Corp", "Quantum", "Echo", "Celestia", "Polymath", "Nova", "Starlight", "Vortex"
];

function MagneticLogo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-6 py-4 group cursor-pointer"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-amber-500/10 blur-xl transition-opacity duration-500 rounded-full" />
      <div className="relative text-zinc-600 font-bold text-xl md:text-3xl uppercase tracking-widest group-hover:text-amber-500 transition-colors duration-300">
        {children}
      </div>
    </motion.div>
  );
}

export default function TrustBySection() {
  return (
    <section className="py-12 border-y border-white/5 bg-zinc-950/40 backdrop-blur-md overflow-hidden relative z-20 pointer-events-auto flex items-center group/section">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-marquee {
          animation: scrollMarquee 30s linear infinite;
        }
        .group\\/section:hover .animate-scroll-marquee {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
      
      <div className="flex whitespace-nowrap relative z-20">
        <div className="flex items-center gap-12 md:gap-24 px-8 animate-scroll-marquee">
          {/* We duplicate the array to make the infinite scroll seamless */}
          {[...logos, ...logos].map((logo, index) => (
            <MagneticLogo key={index}>
              {logo}
            </MagneticLogo>
          ))}
        </div>
      </div>
    </section>
  );
}
