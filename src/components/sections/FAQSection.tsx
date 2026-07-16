"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import BlurText from "../ui/BlurText";

const faqs = [
  {
    question: "What is your typical design and development process?",
    answer: "I start by understanding your goals and target audience. Then, I move to wireframing, high-fidelity UI design in Figma, and finally, frontend development using Next.js and Tailwind CSS with custom animations."
  },
  {
    question: "How long does a typical project take?",
    answer: "For a standard landing page, it usually takes 2-3 weeks from concept to launch. More complex web applications with 3D elements or heavy animations can take 4-8 weeks."
  },
  {
    question: "Do you work with existing designs?",
    answer: "Yes! If you already have a Figma file or a brand guideline, I can step in as a Frontend Engineer to bring those designs to life with pixel-perfect accuracy and smooth interactions."
  },
  {
    question: "What technologies do you specialize in?",
    answer: "My core stack includes React, Next.js, Tailwind CSS, TypeScript, and Framer Motion. For 3D experiences, I use Three.js and React Three Fiber."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20% 0px" });

  return (
    <section ref={sectionRef} id="faq" className="py-24 md:py-32 w-full px-6 lg:px-12 bg-zinc-950 relative z-20 pointer-events-auto overflow-hidden">
      
      {/* Focal Pulse Effect */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={isInView ? { x: "200%", opacity: [0, 1, 0] } : {}}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 w-full h-[400px] -translate-y-1/2 bg-amber-500/20 blur-[120px] pointer-events-none rounded-full"
      />

      <div className="max-w-[800px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-50 mb-4">
            <BlurText text="Frequently Asked Questions" />
          </h2>
          <p className="text-zinc-400">Everything you need to know about working with me.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4
              }
            }
          }}
          className="flex flex-col gap-4"
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
                visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="border border-white/10 rounded-2xl bg-zinc-900/30 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
              >
                <span className="text-lg font-medium text-zinc-100">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-amber-500 shrink-0 ml-4"
                >
                  <CaretDown size={24} />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-zinc-400 leading-relaxed">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                      >
                        {faq.answer}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
