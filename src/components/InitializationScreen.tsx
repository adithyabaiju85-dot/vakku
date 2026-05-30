"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InitializationScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phase1 = setTimeout(() => setPhase(1), 1500); // Show description
    const phase2 = setTimeout(() => setPhase(2), 3000); // Show engineered by
    const finish = setTimeout(() => {
      onComplete();
    }, 4500); // Complete and transition to login

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      
      {/* Subtle glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[200px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        {phase >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <h1 className="text-[48px] font-bold text-white tracking-[8px] uppercase mb-4">
              VAAKKU
            </h1>
            <p className="text-[18px] text-neutral-400 tracking-[4px] uppercase leading-relaxed max-w-2xl mx-auto">
              The Unfiltered Voice
            </p>
            <p className="text-[16px] text-neutral-500 tracking-[2px] mt-6 leading-relaxed max-w-xl mx-auto">
              A platform where voices matter. Share your thoughts, connect with others, and be heard without filters.
            </p>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-16"
          >
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />
            <p className="text-[14px] text-neutral-500 tracking-[6px] uppercase mb-4">
              Engineered By
            </p>
            <h2 className="text-[32px] font-bold text-primary tracking-[4px] uppercase">
              eplupza
            </h2>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black via-black/98 to-transparent z-20"
        initial={{ height: 0 }}
        animate={{ height: 96 }}
        transition={{ delay: 0.3, duration: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/98 to-transparent z-20"
        initial={{ height: 0 }}
        animate={{ height: 96 }}
        transition={{ delay: 0.3, duration: 1 }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)'
      }} />
    </div>
  );
}
