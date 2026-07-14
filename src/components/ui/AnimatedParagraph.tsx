"use client";

import { motion } from "framer-motion";

type TextSegment = {
  text: string;
  className?: string;
};

interface AnimatedParagraphProps {
  segments: TextSegment[];
  className?: string;
}

export default function AnimatedParagraph({ segments, className = "" }: AnimatedParagraphProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1]
      },
    },
  };

  return (
    <motion.div
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
    >
      {segments.map((seg, i) => {
        // Split segment into words to animate word by word
        const words = seg.text.split(" ");
        return (
          <span key={i} className={`inline-flex flex-wrap ${seg.className || ""}`}>
            {words.map((word, wordIndex) => (
              <motion.span variants={child} key={wordIndex} className="mr-2 mb-2 inline-block">
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.div>
  );
}
