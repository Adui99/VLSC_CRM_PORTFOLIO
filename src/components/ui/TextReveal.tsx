"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { once: false, margin: "-10%" });
  
  const words = text.split(" ");
  
  return (
    <p ref={container} className={cn("flex flex-wrap gap-x-2 gap-y-1 leading-tight", className)}>
      {words.map((word, i) => {
        return (
          <span key={i} className="overflow-hidden relative inline-flex">
            <motion.span
              initial={{ y: "100%", opacity: 0, rotateZ: 5 }}
              animate={isInView ? { y: 0, opacity: 1, rotateZ: 0 } : { y: "100%", opacity: 0, rotateZ: 5 }}
              transition={{
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1], // fluid CSS cubic-bezier
                delay: i * 0.05,
              }}
              className="origin-bottom-left"
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
}
