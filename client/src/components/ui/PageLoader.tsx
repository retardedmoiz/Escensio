"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already loaded in this session
    const hasLoaded = sessionStorage.getItem("escensio-loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 80);

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("escensio-loaded", "1");
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0b09]"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="mb-12"
          >
            <Image
              src="/escensio-logo.png"
              alt="Escensio"
              width={160}
              height={54}
              className="invert brightness-200 object-contain"
              priority
            />
          </motion.div>

          {/* Progress line */}
          <div className="w-36 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-white/70"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-[10px] text-white uppercase tracking-[0.4em] font-sans"
          >
            The Essence of Luxury
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
