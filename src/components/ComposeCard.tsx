"use client";

import React, { useState } from "react";
import { useAppState, Post } from "@/context/StateContext";
import { IconMask, IconSend, IconFlame, IconSun, IconMoodConfuzed, IconHeart, IconAlertTriangle } from "@tabler/icons-react";

export default function ComposeCard() {
  const { addPost } = useAppState();
  const [text, setText] = useState("");
  const [selectedTag, setSelectedTag] = useState<Post["tag"]>("society");
  const [selectedMood, setSelectedMood] = useState<Post["mood"]>("serious");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addPost(text, selectedTag, selectedMood);
    setText("");
    // Keep topic, but reset mood or keep
    setSelectedMood("serious");
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
    <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Top: Avatar + Textarea */}
        <div className="flex items-start gap-3">
          {/* Green-tinted Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary-dark shrink-0">
            <IconMask size={18} stroke={1.8} />
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="your voice, no name attached. speak."
            rows={3}
            className="w-full text-[14px] leading-relaxed text-neutral-800 placeholder-neutral-400 bg-transparent border-0 outline-none resize-none py-1 focus:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="w-full h-[0.5px] bg-black/5" />

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
                        ? "bg-primary border-primary text-white font-medium"
                        : "bg-white border-black/5 text-neutral-600 hover:bg-neutral-50"
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
                        ? "bg-primary-light border-primary-border text-primary-dark font-medium"
                        : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
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
          <div className="flex justify-end items-center sm:self-end">
            <button
              type="submit"
              disabled={isTextEmpty}
              className={`px-4 py-1.5 rounded-pill text-[13px] font-medium flex items-center gap-1.5 transition-all select-none ${
                isTextEmpty
                  ? "bg-neutral-100 text-neutral-400 border border-black/5 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark cursor-pointer font-medium active:scale-[0.97]"
              }`}
            >
              <span>speak</span>
              <IconSend size={12} stroke={2} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
