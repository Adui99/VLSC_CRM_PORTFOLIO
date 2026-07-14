"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export default function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const maxIterations = text.length;
    
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        return text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
      });

      if (iteration >= maxIterations) {
        clearInterval(interval);
      }

      iteration += 1 / 3; // Controls speed of unscrambling
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <motion.span 
      ref={ref}
      className={`inline-block font-mono ${className}`}
    >
      {displayText}
    </motion.span>
  );
}
