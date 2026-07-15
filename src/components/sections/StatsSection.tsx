"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  {
    id: 1,
    value: 20,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    id: 2,
    value: 3,
    suffix: "+",
    label: "Years of Experience",
  },
  {
    id: 3,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
  },
];

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 80,
  });

  useEffect(() => {
    if (inView) {
      // Small timeout to ensure it starts after the fade-in begins
      setTimeout(() => {
        motionValue.set(value);
      }, 200);
    } else {
      motionValue.set(0);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest)) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // once: false allows the animation to replay when scrolling up and down
  const inView = useInView(containerRef, { once: false, margin: "-100px" });

  return (
    <section className="py-20 md:py-24 w-full px-6 lg:px-12 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-[1200px] mx-auto" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="text-5xl md:text-6xl font-bold tracking-tighter text-zinc-50 mb-4">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-zinc-400 font-medium text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
