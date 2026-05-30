"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playEngineSound, stopEngineSound } from "@/utils/audio";

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Play futuristic sound when intro starts
    playEngineSound();

    const phase1 = setTimeout(() => setPhase(1), 2000); // Title reveal
    const phase2 = setTimeout(() => setPhase(2), 3500); // Engineered by
    const finish = setTimeout(() => {
      stopEngineSound(); // Stop sound when intro completes
      onComplete(); // Auto-transition to next page (onboarding/login)
    }, 5000); // Complete after 5 seconds

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(finish);
      stopEngineSound(); // Cleanup on unmount
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-['Orbitron']">
      {/* Futuristic background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/30 to-black" />
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute w-full h-px bg-cyan-500/50"
              style={{ top: `${i * 5}%` }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleX: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute h-full w-px bg-cyan-500/50"
              style={{ left: `${i * 5}%` }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleY: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        
        {/* Neon particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
              boxShadow: '0 0 15px currentColor',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 0.5, 0],
              x: [0, (Math.random() - 0.5) * 150],
              y: [0, (Math.random() - 0.5) * 150]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Cyber lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent"
            style={{
              width: Math.random() * 300 + 200,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              x: [-200, window.innerWidth + 200],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1.5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Neon glow orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[150px]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="title"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center"
          >
            {/* Dramatic title reveal */}
            <div className="relative">
              {/* Massive neon glow behind */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] rounded-full bg-gradient-radial from-cyan-500/40 via-purple-500/20 to-transparent blur-[300px]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Cyber shockwave */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-500/40"
                  style={{
                    width: `${500 + i * 200}px`,
                    height: `${500 + i * 200}px`
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6],
                    borderWidth: ['2px', '6px', '2px']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              <motion.h1
                className="text-[160px] font-black text-white tracking-[25px] uppercase relative"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 40px rgba(6,182,212,0.8), 0 0 80px rgba(139,92,246,0.6), 0 0 120px rgba(6,182,212,0.4)'
                }}
                initial={{ opacity: 0, letterSpacing: "80px", scale: 0.8 }}
                animate={{ opacity: 1, letterSpacing: "25px", scale: 1 }}
                transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                SAPPOSE
              </motion.h1>
              
              <motion.h2
                className="text-[70px] font-black text-cyan-400 tracking-[18px] uppercase mt-4 relative"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 30px rgba(6,182,212,0.8), 0 0 60px rgba(139,92,246,0.4)'
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                VERSE
              </motion.h2>
              
              {/* Cyber divider */}
              <motion.div
                className="w-80 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-8"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 320 }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                style={{
                  boxShadow: '0 0 30px rgba(6,182,212,0.8)'
                }}
              />
            </div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="engineered"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center"
          >
            {/* Engineered by */}
            <div className="relative">
              {/* Dramatic glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-gradient-radial from-purple-500/30 via-cyan-500/15 to-transparent blur-[250px]"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.p
                className="text-[22px] text-cyan-300/80 tracking-[10px] uppercase mb-8 font-light"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
              >
                Engineered By
              </motion.p>
              
              <motion.h1
                className="text-[110px] font-black text-purple-400 tracking-[14px] uppercase"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 50px rgba(139,92,246,0.8), 0 0 100px rgba(6,182,212,0.4)'
                }}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                sapposeverse
              </motion.h1>
              
              {/* Cyber divider */}
              <motion.div
                className="w-64 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-8"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 256 }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                style={{
                  boxShadow: '0 0 30px rgba(139,92,246,0.8)'
                }}
              />
              
              {/* Loading indicator */}
              <motion.div
                className="mt-10 flex justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-cyan-400"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/99 to-transparent z-20"
        initial={{ height: 0 }}
        animate={{ height: 160 }}
        transition={{ delay: 0.2, duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/99 to-transparent z-20"
        initial={{ height: 0 }}
        animate={{ height: 160 }}
        transition={{ delay: 0.2, duration: 2, ease: "easeInOut" }}
      />

      {/* Dramatic vignette */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.9) 100%)'
      }} />
    </div>
  );
}
