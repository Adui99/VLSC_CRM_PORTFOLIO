"use client";

import { motion } from "framer-motion";
import { useModalStore } from "@/store/useModalStore";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Work", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const openModal = useModalStore((state) => state.openModal);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    navLinks.forEach((link) => {
      const id = link.href.substring(1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 pointer-events-none"
    >
      {/* Left: Logo */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="pointer-events-auto px-6 py-3 rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl flex items-center hover:bg-zinc-800/80 transition-colors"
      >
        <div className="text-amber-500 font-bold tracking-tighter text-lg">
          KTD
        </div>
      </button>
      
      {/* Center: Links */}
      <div 
        className="hidden md:flex pointer-events-auto px-2 py-2 rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl items-center gap-1"
        onMouseLeave={() => setHoveredLink(null)}
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.href;
          return (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              className={`relative px-5 py-2.5 text-sm font-medium transition-colors z-10 ${
                isActive || hoveredLink === link.name ? "text-zinc-50" : "text-zinc-400"
              }`}
            >
              {hoveredLink === link.name && (
                <motion.div
                  layoutId="navbar-hover-pill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              {link.name}
              
              {isActive && (
                <motion.div
                  layoutId="navbar-active-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Right: CTA */}
      <div className="pointer-events-auto">
        <button 
          onClick={openModal}
          className="px-6 py-3 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 backdrop-blur-xl shadow-2xl transition-all font-medium text-sm"
        >
          Let's Talk
        </button>
      </div>
    </motion.nav>
  );
}
