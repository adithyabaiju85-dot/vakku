"use client";

import React, { useState, useEffect } from "react";
import { useAppState } from "@/context/StateContext";
import { getInitials, getColorPairForName } from "@/utils/identity";
import { IconRefresh, IconArrowRight, IconMask, IconShieldLock, IconFlame, IconCompass } from "@tabler/icons-react";

export default function Onboarding() {
  const { identity, shuffleIdentity, setOnboarded } = useAppState();
  const [step, setStep] = useState<1 | 2>(1);
  const [tempName, setTempName] = useState(identity);

  // Sync tempName when identity is shuffled from parent state
  useEffect(() => {
    setTempName(identity);
  }, [identity]);

  const handleLocalShuffle = () => {
    shuffleIdentity();
  };

  const handleContinue = () => {
    if (tempName.trim()) {
      setStep(2);
    }
  };

  const handleEnterSpace = () => {
    if (tempName.trim()) {
      setOnboarded(tempName);
    }
  };

  const avatarStyle = getColorPairForName(tempName || "anonymous");
  const initials = getInitials(tempName || "anonymous");

  return (
    <div className="fixed inset-0 z-50 bg-brandBg flex items-center justify-center p-5 select-none animate-fade-in overflow-y-auto">
      <div className="w-full max-w-[460px] bg-brandCard border border-black/10 rounded-card p-6 md:p-8 flex flex-col gap-6 relative my-auto">
        
        {/* Step Indicator Dot Header */}
        <div className="flex items-center justify-between">
          <span className="text-[19px] font-medium tracking-[-0.5px] text-black">
            vaakku<span className="text-primary font-medium">.</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${step === 1 ? "bg-primary w-4" : "bg-neutral-200"}`} />
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${step === 2 ? "bg-primary w-4" : "bg-neutral-200"}`} />
          </div>
        </div>

        {step === 1 ? (
          /* PHASE 1: CHOOSE ANONYMOUS MASK */
          <div className="flex flex-col gap-5 fade-in">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[20px] font-medium tracking-tight text-neutral-900 leading-tight">
                claim your temporary mask.
              </h1>
              <p className="text-[12px] text-neutral-400 leading-relaxed">
                Choose a custom name or click shuffle to grab a random anonymous identity. Your thoughts represent you—not your permanent digital record.
              </p>
            </div>

            {/* Visual Live Avatar Preview Box */}
            <div className="flex flex-col items-center justify-center p-5 bg-brandBg/60 border border-black/5 rounded-card gap-2.5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-[19px] font-medium transition-all duration-300"
                style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
              >
                {initials}
              </div>
              <span className="text-[11px] font-medium uppercase text-neutral-400 tracking-[0.5px]">
                live mask preview
              </span>
            </div>

            {/* Input field & Shuffle row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  maxLength={25}
                  placeholder="enter an anonymous handle..."
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value.replace(/\s+/g, "_").toLowerCase())}
                  className="w-full text-[13px] bg-brandBg border border-black/10 rounded-pill px-4 py-2.5 outline-none placeholder-neutral-400 text-neutral-800 focus:border-primary/40 focus:bg-white font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleLocalShuffle}
                className="px-4 py-2.5 bg-brandBg border border-black/10 rounded-pill hover:bg-neutral-100 transition-all text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 active:scale-[0.97]"
                title="Shuffle anonymous mask"
              >
                <IconRefresh size={14} stroke={2} />
                <span className="text-[12px] font-medium hidden sm:inline">shuffle</span>
              </button>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!tempName.trim()}
              className={`w-full py-2.5 rounded-pill text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all select-none ${
                tempName.trim()
                  ? "bg-primary text-white hover:bg-primary-dark cursor-pointer font-medium active:scale-[0.97]"
                  : "bg-neutral-100 text-neutral-400 border border-black/5 cursor-not-allowed"
              }`}
            >
              <span>continue to platform purpose</span>
              <IconArrowRight size={14} stroke={2} />
            </button>
          </div>
        ) : (
          /* PHASE 2: PLATFORM DESCRIPTION & RULES */
          <div className="flex flex-col gap-5 fade-in">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[20px] font-medium tracking-tight text-neutral-900 leading-tight">
                what is vaakku.?
              </h1>
              <p className="text-[12px] text-neutral-500 leading-relaxed">
                An anonymous opinion-sharing platform for Kerala's youth. Speak freely about the issues that define your generation without fear of permanent digital trails.
              </p>
            </div>

            {/* Sleek Pillars Grid */}
            <div className="flex flex-col gap-2.5">
              {/* Pillar 1 */}
              <div className="flex gap-3 bg-brandBg/60 border border-black/5 rounded-[12px] p-3">
                <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary-dark shrink-0">
                  <IconShieldLock size={16} stroke={1.8} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-medium text-neutral-800">Dynamic session masking</span>
                  <span className="text-[10px] text-neutral-400 leading-relaxed">
                    No persistent profiles. Your comments and posts run on randomized tags to protect your identity.
                  </span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex gap-3 bg-brandBg/60 border border-black/5 rounded-[12px] p-3">
                <div className="w-8 h-8 rounded-full bg-reaction-fire-bg border border-reaction-fire/15 flex items-center justify-center text-reaction-fire-text shrink-0">
                  <IconFlame size={16} stroke={1.8} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-medium text-neutral-800">Kerala emotional pulse</span>
                  <span className="text-[10px] text-neutral-400 leading-relaxed">
                    Filter opinion feeds dynamically by frustrated, hopeful, confused, proud, or serious moods.
                  </span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex gap-3 bg-brandBg/60 border border-black/5 rounded-[12px] p-3">
                <div className="w-8 h-8 rounded-full bg-reaction-think-bg border border-reaction-think/15 flex items-center justify-center text-reaction-think-text shrink-0">
                  <IconCompass size={16} stroke={1.8} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-medium text-neutral-800">Category-focused critique</span>
                  <span className="text-[10px] text-neutral-400 leading-relaxed">
                    Dedicated discussion nodes for jobs, state politics, local culture, climate, and education.
                  </span>
                </div>
              </div>
            </div>

            {/* Back to Mask Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 bg-brandBg border border-black/10 rounded-pill hover:bg-neutral-100 transition-all text-neutral-600 font-medium text-[12px] active:scale-[0.97]"
              >
                go back
              </button>
              
              {/* Final Enter Button */}
              <button
                onClick={handleEnterSpace}
                className="flex-[2] py-2.5 bg-primary hover:bg-primary-dark text-white rounded-pill transition-all font-medium text-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97]"
              >
                <span>enter the space</span>
                <IconMask size={14} stroke={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
