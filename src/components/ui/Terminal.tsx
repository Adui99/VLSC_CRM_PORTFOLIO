"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const codeLines = [
  "const engineer = new SoftwareEngineer();",
  "engineer.setSkills(['React', 'Next.js', 'Three.js']);",
  "engineer.passion = 'Building immersive web experiences';",
  "await engineer.init();",
  " ",
  "> System ready.",
  "> Compiling awesomeness...",
  "> Done in 0.42s",
];

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) return;

    const currentLine = codeLines[currentLineIndex];

    const typeChar = () => {
      if (currentCharIndex < currentLine.length) {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = "";
          }
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 300); // Pause before next line
      }
    };

    const typingSpeed = currentLine.startsWith(">") ? 10 : 40;
    const timer = setTimeout(typeChar, Math.random() * typingSpeed + typingSpeed);
    
    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm md:text-base">
      {/* Mac OS Window Header */}
      <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="mx-auto text-zinc-400 text-xs font-medium">terminal — bash</div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-6 h-[250px] md:h-[350px] overflow-y-auto text-zinc-300">
        <div className="flex flex-col gap-2">
          {displayedLines.map((line, i) => {
            const isCommand = line.startsWith(">");
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }}
                className={isCommand ? "text-amber-500 font-bold mt-2" : ""}
              >
                {isCommand ? line : <span className="text-pink-500">➜</span>} {!isCommand && <span className="text-blue-400">~</span>} {line}
              </motion.div>
            );
          })}
          {/* Blinking Cursor */}
          {currentLineIndex < codeLines.length && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2.5 h-5 bg-amber-500 mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
