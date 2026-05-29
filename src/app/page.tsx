"use client";

import React, { useState, useEffect } from "react";
import { useAppState, Post } from "@/context/StateContext";
import ComposeCard from "@/components/ComposeCard";
import VoiceCard from "@/components/VoiceCard";
import { IconFlame, IconSun, IconMoodConfuzed, IconHeart, IconAlertTriangle, IconLayoutDashboard, IconClockPlay } from "@tabler/icons-react";

type SortMode = "hot" | "fresh" | "most voices";
type MoodFilter = "all" | Post["mood"];

export default function FeedPage() {
  const { posts, isLoading } = useAppState();
  const [selectedMood, setSelectedMood] = useState<MoodFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortMode>("hot");
  
  // Auto-rotation state
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isInactive, setIsInactive] = useState(false);

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

  // Weighted score calculation for hot sort
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
      const voicesA = a.fire + a.heart + a.think;
      const voicesB = b.fire + b.heart + b.think;
      return voicesB - voicesA;
    }
  });

  // Reset index when filters change
  useEffect(() => {
    setVisibleStartIndex(0);
  }, [selectedMood, selectedSort]);

  // Inactivity Auto-Rotation Logic (15 seconds)
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setIsInactive(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsInactive(true);
      }, 15000); // 15 seconds to inactivity
    };

    // Listeners for activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    // Initial start
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  // When inactive, rotate every 5 seconds
  useEffect(() => {
    let rotationInterval: NodeJS.Timeout;
    if (isInactive && sortedPosts.length > 2) {
      rotationInterval = setInterval(() => {
        setVisibleStartIndex((prev) => (prev + 2) % sortedPosts.length);
      }, 5000);
    }
    return () => clearInterval(rotationInterval);
  }, [isInactive, sortedPosts.length]);

  // Display only 2 thoughts
  const displayedPosts = sortedPosts.slice(visibleStartIndex, visibleStartIndex + 2);

  // If we sliced near the end and got 1 item but there are more, wrap around to fill the 2 slots
  if (displayedPosts.length === 1 && sortedPosts.length > 1) {
    displayedPosts.push(sortedPosts[0]);
  }

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Compose post card */}
      <ComposeCard />

      {/* Mood filter strip */}
      <div className="w-full glass-card rounded-card p-3 flex flex-col gap-2 relative z-10">
        <span className="text-[11px] font-bold text-primary uppercase tracking-[1px] flex items-center gap-1.5">
          <IconLayoutDashboard size={14} /> what's the vibe
        </span>
        
        {/* Horizontal scroll row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {moods.map((mood) => {
            const isActive = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`px-3 py-1.5 rounded-pill border text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all select-none ${
                  isActive
                    ? "bg-primary border-primary text-black scale-[1.02] shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {mood.icon}
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Row & Inactivity Indicator */}
      <div className="flex items-center justify-between mt-1 select-none relative z-10">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-pill">
          {sortOptions.map((opt) => {
            const isActive = selectedSort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedSort(opt.value)}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.5px] transition-all rounded-pill ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Counter of shown items & Auto-rotate badge */}
        <div className="flex items-center gap-3">
          {isInactive && sortedPosts.length > 2 && (
            <span className="flex items-center gap-1 text-[10px] text-primary uppercase font-bold tracking-[1px] animate-pulse">
              <IconClockPlay size={12} /> auto-rotating
            </span>
          )}
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-[0.5px]">
            {sortedPosts.length} total voices
          </span>
        </div>
      </div>

      {/* Feed List (Recent Thoughts) */}
      <div className="flex flex-col gap-4 relative z-10">
        
        {/* Recent Thoughts Heading */}
        <h2 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2 mt-2">
          Recent Thoughts <span className="text-primary font-bold neon-text">.</span>
        </h2>

        {isLoading ? (
          // Loading skeleton state
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[140px] glass-card border border-white/10 rounded-card p-5 animate-pulse flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
            </div>
          ))
        ) : displayedPosts.length > 0 ? (
          <div className="flex flex-col gap-4 fade-in" key={visibleStartIndex}>
            {displayedPosts.map((post) => <VoiceCard key={post.id} post={post} />)}
          </div>
        ) : (
          // Empty feed state
          <div className="w-full glass-card border border-white/10 rounded-card p-10 text-center flex flex-col items-center justify-center gap-3">
            <span className="text-[16px] font-bold text-white">
              no voices here yet — be the first.
            </span>
            <span className="text-[12px] text-neutral-400 max-w-[280px]">
              Speak your mind anonymized without fear or names. Share a story, an opinion, or a question!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
