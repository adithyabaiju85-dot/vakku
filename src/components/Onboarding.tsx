"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "@/context/StateContext";
import { getInitials, getColorPairForName } from "@/utils/identity";
import { IconRefresh, IconArrowRight, IconShieldLock, IconCamera, IconUpload } from "@tabler/icons-react";
import { playClickSound } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const { identity, shuffleIdentity, setOnboarded, profiles } = useAppState();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [tempName, setTempName] = useState(identity);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempName(identity);
  }, [identity]);

  const handleLocalShuffle = () => {
    playClickSound();
    shuffleIdentity();
  };

  const handleContinue = () => {
    if (tempName.trim()) {
      playClickSound();
      setStep(2);
    }
  };

  const handleEnterSpace = () => {
    if (tempName.trim()) {
      playClickSound();
      setOnboarded(tempName, tempAvatar || undefined);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB for local storage.");
        return;
      }
      playClickSound();
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isProfileFound = tempName.trim() && profiles[tempName.trim()];
  const displayAvatar = tempAvatar || (isProfileFound ? isProfileFound.avatar : null);

  const avatarStyle = getColorPairForName(tempName || "anonymous");
  const initials = getInitials(tempName || "anonymous");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-[#000000] flex items-center justify-center p-5 select-none overflow-y-auto">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[420px] glass-card border border-white/10 rounded-[32px] p-8 flex flex-col gap-8 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[28px] font-bold tracking-[-1px] text-white">
            vaakku<span className="text-primary neon-text">.</span>
          </span>
          <span className="text-[11px] uppercase tracking-[2px] font-bold text-neutral-500">
            {step === 0 ? "Initialization" : step === 1 ? "Identity Setup" : "Security Protocol"}
          </span>
        </div>

        {step === 0 ? (
          /* PHASE 0: WELCOME & DEVELOPER CREDIT */
          <div className="flex flex-col gap-6 fade-in items-center text-center">
            <h2 className="text-[20px] font-bold text-white tracking-tight">The Unfiltered Voice.</h2>
            <p className="text-[14px] text-neutral-400 leading-relaxed">
              Vaakku is a high-performance, zero-persistence opinion engine. Speak your mind without the baggage of permanent profiles.
            </p>
            <div className="w-full p-4 bg-primary/10 border border-primary/20 rounded-xl mt-2">
              <span className="text-[11px] uppercase tracking-[2px] font-bold text-primary">Engineered By</span>
              <p className="text-[16px] font-bold text-white mt-1">eplupza</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { playClickSound(); setStep(1); }}
              className="w-full py-4 mt-2 bg-white text-black hover:bg-primary shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-pill transition-all font-bold text-[14px] uppercase tracking-[1px] flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Begin Setup</span>
              <IconArrowRight size={18} stroke={2.5} />
            </motion.button>
          </div>
        ) : step === 1 ? (
          /* PHASE 1: LOGIN / AVATAR SETUP */
          <div className="flex flex-col gap-7 fade-in">
            
            {/* Avatar Upload / Preview */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div 
                className="relative group cursor-pointer"
                onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-[32px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] border-2 border-white/10 overflow-hidden bg-cover bg-center transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                  style={{ 
                    backgroundColor: displayAvatar ? 'transparent' : avatarStyle.bg, 
                    color: avatarStyle.text,
                    backgroundImage: displayAvatar ? `url(${displayAvatar})` : 'none'
                  }}
                >
                  {!displayAvatar && initials}
                </div>
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconCamera size={24} className="text-white" />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <button 
                onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
                className="text-[12px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-[0.5px]"
              >
                <IconUpload size={14} /> Upload Custom Avatar
              </button>
            </div>

            {/* Input field & Shuffle row */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-[1px] ml-2">Anonymous Handle</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="enter a handle..."
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value.replace(/\s+/g, "_").toLowerCase())}
                    className="w-full text-[14px] bg-white/5 border border-white/10 rounded-pill px-5 py-3 outline-none placeholder-neutral-600 text-white focus:border-primary/50 transition-all font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLocalShuffle}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/30 transition-all text-neutral-400 flex items-center justify-center active:scale-[0.95]"
                  title="Shuffle handle"
                >
                  <IconRefresh size={18} stroke={2} />
                </button>
              </div>
            </div>

            {/* Profile Status Indicator */}
            {isProfileFound && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-[12px] font-bold text-primary flex items-center justify-center gap-1 -mt-2 bg-primary/10 py-1.5 rounded-full border border-primary/20"
              >
                <IconShieldLock size={14} /> Profile Identified.
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: tempName.trim() ? 1.02 : 1 }}
              whileTap={{ scale: tempName.trim() ? 0.98 : 1 }}
              onClick={handleContinue}
              disabled={!tempName.trim()}
              className={`w-full py-4 rounded-pill text-[14px] font-bold uppercase tracking-[1px] flex items-center justify-center gap-2 transition-all mt-2 ${
                tempName.trim()
                  ? "bg-primary text-black hover:bg-white hover:text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-[0.98]"
                  : "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
              }`}
            >
              <span>{isProfileFound ? "Resume Session" : "Initialize Session"}</span>
              <IconArrowRight size={18} stroke={2} />
            </motion.button>
          </div>
        ) : (
          /* PHASE 2: PRIVACY WARNING */
          <div className="flex flex-col gap-6 fade-in">
            
            <div className="flex flex-col items-center text-center gap-4 bg-primary/10 border border-primary/20 rounded-[24px] p-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <IconShieldLock size={32} stroke={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[18px] font-bold text-white tracking-tight">Privacy is our Priority.</h2>
                <p className="text-[13px] text-neutral-400 leading-relaxed">
                  Vaakku operates on a strict zero-persistence policy. Your identity is localized to your session. There are no tracking cookies, no permanent profiles, and your thoughts are anonymized upon broadcast.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {/* Back to Mask Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { playClickSound(); setStep(1); }}
                className="w-full py-3 bg-transparent border border-white/10 rounded-pill hover:bg-white/5 transition-all text-neutral-400 font-bold text-[13px] uppercase tracking-[1px] active:scale-[0.98]"
              >
                Go Back
              </motion.button>
              
              {/* Final Enter Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnterSpace}
                className="w-full py-4 bg-white text-black hover:bg-primary shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] rounded-pill transition-all font-bold text-[14px] uppercase tracking-[1px] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Acknowledge & Enter</span>
                <IconArrowRight size={18} stroke={2.5} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
