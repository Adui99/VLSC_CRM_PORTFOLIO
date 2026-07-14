"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function LoadingScreen() {
  const [internalLoading, setInternalLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    // Animate progress from 0 to 100 over 2 seconds
    const duration = 2000;
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setInternalLoading(false);
          setLoading(false); // Update global store
        }, 300); // slight delay before hiding screen
      }
    }, interval);

    return () => clearInterval(timer);
  }, [setLoading]);

  return (
    <AnimatePresence>
      {internalLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 pointer-events-none"
        >
          {/* Main Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            className="text-amber-500 font-bold tracking-tighter text-5xl mb-8 relative"
          >
            KTD
            {/* Glowing effect behind logo */}
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-amber-500 blur-xl z-[-1]"
            />
          </motion.div>

          {/* Progress text */}
          <div className="text-amber-500 font-mono text-xl mb-4 font-bold">
            {progress}%
          </div>

          {/* Loading Bar */}
          <div className="w-48 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-amber-500 transition-all duration-75 ease-linear"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-6"
          >
            Initializing Experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
