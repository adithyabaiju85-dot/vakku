"use client";

import React, { useState } from "react";
import { useAppState, Post } from "@/context/StateContext";
import ComposeCard from "@/components/ComposeCard";
import VoiceCard from "@/components/VoiceCard";
import { IconFlame, IconSun, IconMoodConfuzed, IconHeart, IconAlertTriangle, IconLayoutDashboard } from "@tabler/icons-react";

type SortMode = "hot" | "fresh" | "most voices";
type MoodFilter = "all" | Post["mood"];

export default function FeedPage() {
  const { posts, isLoading } = useAppState();
  const [selectedMood, setSelectedMood] = useState<MoodFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortMode>("hot");

  const moods: { value: MoodFilter; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "all", icon: <IconLayoutDashboard size={14} /> },
    { value: "frustrated", label: "frustrated", icon: <IconFlame size={14} /> },
    { value: "hopeful", label: "hopeful", icon: <IconSun size={14} /> },
    { value: "confused", label: "confused", icon: <IconMoodConfuzed size={14} /> },
    { value: "proud", label: "proud", icon: <IconHeart size={14} /> },
    { value: "serious", label: "serious", icon: <IconAlertTriangle size={14} /> },
  ];

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "hot", label: "hot" },
    { value: "fresh", label: "fresh" },
    { value: "most voices", label: "most voices" },
  ];

  // Weighted score calculation for hot sort: (fire × 1.5) + heart + think + (comments × 2)
  const calculateHotScore = (post: Post) => {
    return (post.fire * 1.5) + post.heart + post.think + (post.comments * 2);
  };

  // Filter posts by mood
  const filteredPosts = posts.filter((post) => {
    if (selectedMood === "all") return true;
    return post.mood === selectedMood;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (selectedSort === "hot") {
      return calculateHotScore(b) - calculateHotScore(a);
    } else if (selectedSort === "fresh") {
      return b.ts - a.ts;
    } else {
      // most voices: fire + heart + think
      const voicesA = a.fire + a.heart + a.think;
      const voicesB = b.fire + b.heart + b.think;
      return voicesB - voicesA;
    }
  });

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Mood filter strip */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-3 flex flex-col gap-2">
        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px]">
          what's the vibe:
        </span>
        
        {/* Horizontal scroll row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {moods.map((mood) => {
            const isActive = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`px-3 py-1 rounded-pill border text-[12px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all select-none ${
                  isActive
                    ? "bg-primary-light border-primary-border text-primary-dark font-medium scale-[1.02]"
                    : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                {mood.icon}
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compose post card */}
      <ComposeCard />

      {/* Sort Row */}
      <div className="flex items-center justify-between mt-1 select-none">
        <div className="flex items-center gap-1 bg-brandCard border border-black/5 p-0.5 rounded-pill">
          {sortOptions.map((opt) => {
            const isActive = selectedSort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedSort(opt.value)}
                className={`px-3.5 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-black text-white rounded-pill font-medium"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Counter of shown items */}
        <span className="text-[10px] text-neutral-400 uppercase font-medium tracking-[0.2px]">
          {sortedPosts.length} {sortedPosts.length === 1 ? "voice" : "voices"} shown
        </span>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-[14px] mt-1">
        {isLoading ? (
          // Loading skeleton state
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[120px] bg-brandCard border border-black/10 rounded-card p-4 animate-pulse flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-neutral-200" />
                <div className="h-3 w-24 bg-neutral-200 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-neutral-200 rounded" />
              <div className="h-3 w-1/2 bg-neutral-200 rounded" />
            </div>
          ))
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <VoiceCard key={post.id} post={post} />)
        ) : (
          // Empty feed state
          <div className="w-full bg-brandCard border border-black/10 rounded-card p-8 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-[14px] font-medium text-neutral-600">
              no voices here yet — be the first.
            </span>
            <span className="text-[11px] text-neutral-400 max-w-[240px]">
              Speak your mind anonymized without fear or names. Share a story, an opinion, or a question!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
