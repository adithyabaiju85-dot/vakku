"use client";

import React, { useRef } from "react";
import { useAppState } from "@/context/StateContext";
import { IconX, IconRefresh, IconCamera, IconVolume, IconVolumeOff, IconTrashX } from "@tabler/icons-react";
import { playClickSound } from "@/utils/audio";
import { getInitials, getColorPairForName } from "@/utils/identity";

export default function SettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    identity, 
    userAvatar,
    shuffleIdentity, 
    soundEnabled, 
    setSoundEnabled,
    setUserAvatar,
    clearData
  } = useAppState();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    playClickSound();
    setIsSettingsOpen(false);
  };

  const handleShuffle = () => {
    playClickSound();
    shuffleIdentity();
  };

  const handleToggleSound = () => {
    playClickSound();
    setSoundEnabled(!soundEnabled);
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
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNukeData = () => {
    playClickSound();
    const confirmed = window.confirm("Are you sure you want to completely erase your identity and all local data? This cannot be undone.");
    if (confirmed) {
      clearData();
      setIsSettingsOpen(false);
    }
  };

  const avatarStyle = getColorPairForName(identity || "anonymous");
  const initials = getInitials(identity || "anonymous");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5 select-none animate-fade-in backdrop-blur-md">
      <div className="w-full max-w-[420px] bg-[#000000] border border-white/10 rounded-[32px] p-8 flex flex-col gap-6 relative shadow-[0_0_50px_rgba(0,229,255,0.1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-bold tracking-tight text-white flex items-center gap-2">
            Settings <span className="text-primary neon-text">.</span>
          </span>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary/50 transition-all active:scale-95"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Identity Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500">Current Identity</span>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-card">
              <div 
                className="relative group cursor-pointer shrink-0"
                onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20 overflow-hidden bg-cover bg-center transition-all group-hover:border-primary/50"
                  style={{ 
                    backgroundColor: userAvatar ? 'transparent' : avatarStyle.bg, 
                    color: avatarStyle.text,
                    backgroundImage: userAvatar ? `url(${userAvatar})` : 'none'
                  }}
                >
                  {!userAvatar && initials}
                </div>
                
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconCamera size={18} className="text-white" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[14px] font-bold text-white truncate">{identity}</span>
                <button 
                  onClick={handleShuffle}
                  className="text-[11px] font-bold text-primary hover:text-white uppercase tracking-[1px] flex items-center gap-1 self-start transition-colors"
                >
                  <IconRefresh size={12} /> Shuffle Handle
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500">Preferences</span>
            
            <button 
              onClick={handleToggleSound}
              className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-card hover:bg-white/10 transition-colors active:scale-[0.98]"
            >
              <span className="text-[13px] font-bold text-white">Interface Sounds</span>
              {soundEnabled ? (
                <IconVolume size={20} className="text-primary" />
              ) : (
                <IconVolumeOff size={20} className="text-neutral-600" />
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="flex flex-col gap-3 mt-4">
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-red-500/80">Danger Zone</span>
            
            <button 
              onClick={handleNukeData}
              className="flex items-center justify-between w-full p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-card hover:bg-red-500/20 transition-colors active:scale-[0.98]"
            >
              <span className="text-[13px] font-bold uppercase tracking-[1px]">Erase All Data</span>
              <IconTrashX size={20} />
            </button>
            <p className="text-[11px] text-neutral-500 leading-relaxed text-center mt-1">
              This will destroy your current identity, clear all local posts and comments, and return you to the initial login protocol.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
