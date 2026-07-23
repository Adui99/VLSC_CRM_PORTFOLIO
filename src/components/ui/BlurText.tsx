"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function BlurText({ text, className = "", delay = 0 }: BlurTextProps) {
  const words = useMemo(() => text.split(" "), [text]);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1] as const
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 10,
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-2 mb-1 inline-block">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
