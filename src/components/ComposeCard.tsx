"use client";

import React, { useState } from "react";
import { useAppState, Post } from "@/context/StateContext";
import { IconMask, IconSend, IconFlame, IconSun, IconMoodConfuzed, IconHeart, IconAlertTriangle } from "@tabler/icons-react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
export default function ComposeCard() {
  const { addPost, identity, isDeveloper } = useAppState();
  const [text, setText] = useState("");
  const [selectedTag, setSelectedTag] = useState<Post["tag"]>("society");
  const [selectedMood, setSelectedMood] = useState<Post["mood"]>("serious");
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  // Broadcast typing events for developer watcher
  React.useEffect(() => {
    if (text.trim().length > 0) {
      localStorage.setItem("vaakku_typing_event", JSON.stringify({
        author: identity,
        text,
        ts: Date.now()
      }));
    }
  }, [text, identity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addPost(text, selectedTag, selectedMood, isAnnouncement);
    setText("");
    // Keep topic, but reset mood or keep
    setSelectedMood("serious");
    setIsAnnouncement(false);
  };

  const topics: { value: Post["tag"]; bg: string; text: string }[] = [
    { value: "politics", bg: "bg-tag-politics-bg", text: "text-tag-politics-text" },
    { value: "education", bg: "bg-tag-education-bg", text: "text-tag-education-text" },
    { value: "jobs", bg: "bg-tag-jobs-bg", text: "text-tag-jobs-text" },
    { value: "society", bg: "bg-tag-society-bg", text: "text-tag-society-text" },
    { value: "culture", bg: "bg-tag-culture-bg", text: "text-tag-culture-text" },
    { value: "environment", bg: "bg-tag-environment-bg", text: "text-tag-environment-text" },
  ];

  const moods: { value: Post["mood"]; label: string; icon: React.ReactNode }[] = [
    { value: "frustrated", label: "frustrated", icon: <IconFlame size={13} /> },
    { value: "hopeful", label: "hopeful", icon: <IconSun size={13} /> },
    { value: "confused", label: "confused", icon: <IconMoodConfuzed size={13} /> },
    { value: "proud", label: "proud", icon: <IconHeart size={13} /> },
    { value: "serious", label: "serious", icon: <IconAlertTriangle size={13} /> },
  ];

  const isTextEmpty = !text.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#ffffff"
        glarePosition="bottom"
        glareBorderRadius="24px"
        tiltMaxAngleX={3}
        tiltMaxAngleY={3}
        scale={1.01}
        transitionSpeed={2500}
      >
        <div className="w-full glass-card rounded-[24px] p-5 relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10">
            {/* Top: Avatar + Textarea */}
            <div className="flex items-start gap-3">
              {/* Green-tinted Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shrink-0">
                <IconMask size={18} stroke={1.8} />
              </div>

              {/* Text Area */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="your voice, no name attached. speak."
                rows={3}
                className="w-full text-[14px] leading-relaxed text-white placeholder-neutral-500 bg-transparent border-0 outline-none resize-none py-1 focus:ring-0 typing-font"
              />
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

        {/* Bottom Options & Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2.5">
            {/* Topic Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-neutral-400 font-medium">topic:</span>
              {topics.map((t) => {
                const isSelected = selectedTag === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSelectedTag(t.value)}
                    className={`px-2 py-0.5 text-[11px] rounded-pill border transition-all ${
                      isSelected
                        ? "bg-primary border-primary text-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                    }`}
                  >
                    {t.value}
                  </button>
                );
              })}
            </div>

            {/* Mood Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-neutral-400 font-medium">vibe:</span>
              {moods.map((m) => {
                const isSelected = selectedMood === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMood(m.value)}
                    className={`px-2 py-0.5 text-[11px] rounded-pill border flex items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-primary/20 border-primary/50 text-primary font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                        : "bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10"
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex items-center gap-3">
              {isDeveloper && (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isAnnouncement ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-neutral-600 group-hover:border-yellow-500/50'}`}>
                    {isAnnouncement && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-[1px] ${isAnnouncement ? 'text-yellow-500' : 'text-neutral-500 group-hover:text-neutral-300'}`}>Announcement</span>
                  <input type="checkbox" checked={isAnnouncement} onChange={(e) => setIsAnnouncement(e.target.checked)} className="hidden" />
                </label>
              )}
              
              <button
                type="submit"
                disabled={isTextEmpty}
                className={`px-6 py-2.5 rounded-pill font-bold uppercase tracking-[1px] text-[12px] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                  !isTextEmpty
                    ? isAnnouncement 
                      ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.6)]"
                      : "bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] active:scale-95" 
                    : "bg-white/5 text-neutral-500 cursor-not-allowed"
                }`}
              >
                <span>Broadcast</span>
                <IconSend size={16} stroke={2} />
              </button>
            </div>
        </div>
      </form>
      </div>
      </Tilt>
    </motion.div>
  );
}
