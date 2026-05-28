"use client";

import React from "react";
import { useAppState, Post } from "@/context/StateContext";
import { IconMask, IconBroadcast, IconTrendingUp, IconChartPie } from "@tabler/icons-react";

export default function Sidebar() {
  const { posts, liveNow, voicesToday } = useAppState();

  // 1. Dynamic Mood Aggregation for Today's Pulse
  const moodCounts = { frustrated: 0, hopeful: 0, confused: 0, proud: 0, serious: 0 };
  posts.forEach((p) => {
    if (p.mood in moodCounts) {
      moodCounts[p.mood as keyof typeof moodCounts]++;
    }
  });

  const totalMoods = posts.length || 1;
  const moodPercentages = {
    frustrated: Math.round(((moodCounts.frustrated + 2) / (totalMoods + 5)) * 100), // smooth base preseed
    hopeful: Math.round(((moodCounts.hopeful + 1) / (totalMoods + 5)) * 100),
    confused: Math.round(((moodCounts.confused + 1) / (totalMoods + 5)) * 100),
    proud: Math.round(((moodCounts.proud + 1) / (totalMoods + 5)) * 100),
  };

  // Adjust to sum up cleanly if needed or just display rounded percentages
  const pulseBars = [
    { label: "frustrated", percentage: moodPercentages.frustrated, color: "bg-reaction-fire" },
    { label: "hopeful", percentage: moodPercentages.hopeful, color: "bg-[#5DCAA5]" },
    { label: "confused", percentage: moodPercentages.confused, color: "bg-reaction-think" },
    { label: "proud", percentage: moodPercentages.proud, color: "bg-reaction-heart" },
  ];

  // 2. Dynamic Topic Aggregation for Being Talked About
  const topicCounts: { [key in Post["tag"]]?: number } = {};
  posts.forEach((p) => {
    topicCounts[p.tag] = (topicCounts[p.tag] || 0) + 1;
  });

  // Base starter count additions for trending items
  const baseTopics: { tag: Post["tag"]; baseCount: number }[] = [
    { tag: "jobs", baseCount: 142 },
    { tag: "society", baseCount: 119 },
    { tag: "education", baseCount: 88 },
    { tag: "politics", baseCount: 75 },
    { tag: "environment", baseCount: 54 },
    { tag: "culture", baseCount: 42 },
  ];

  const aggregatedTopics = baseTopics.map((item) => {
    const activeCount = topicCounts[item.tag] || 0;
    return {
      tag: item.tag,
      count: item.baseCount + activeCount,
    };
  });

  // Sort descending by count
  const sortedTopics = [...aggregatedTopics].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <aside className="w-full flex flex-col gap-4 text-[13px]">
      {/* Widget 1: You are masked card */}
      <div className="w-full bg-primary-light border border-primary-border rounded-card p-4 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-primary-dark font-medium">
          <IconMask size={16} stroke={2} />
          <span className="text-[12px] font-medium tracking-tight">you are masked</span>
        </div>
        <p className="text-[12px] leading-relaxed text-primary-dark opacity-90">
          No name. No face. Your identity shuffles every visit. Just your words.
        </p>
      </div>

      {/* Widget 2: Today's Pulse */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 flex flex-col gap-3">
        <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.5px] flex items-center gap-1">
          <IconChartPie size={12} />
          <span>today's pulse</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {pulseBars.map((bar) => (
            <div key={bar.label} className="flex items-center justify-between text-[11px]">
              {/* Label */}
              <span className="w-[85px] text-neutral-500 font-medium">{bar.label}</span>
              {/* Thin progress bar */}
              <div className="flex-1 h-[5px] bg-neutral-100 rounded-full overflow-hidden mx-2">
                <div
                  className={`h-full ${bar.color} rounded-full`}
                  style={{ width: `${bar.percentage}%` }}
                />
              </div>
              {/* Percentage */}
              <span className="text-neutral-700 font-medium text-right w-[28px]">{bar.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Being Talked About (Trending) */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 flex flex-col gap-3">
        <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.5px] flex items-center gap-1">
          <IconTrendingUp size={12} />
          <span>being talked about</span>
        </div>
        <div className="flex flex-col gap-3">
          {sortedTopics.map((topic, index) => (
            <div key={topic.tag} className="flex items-center gap-3 group cursor-pointer">
              {/* Muted Rank Number */}
              <span className="text-[18px] font-medium text-neutral-300 leading-none group-hover:text-primary-dark">
                {index + 1}
              </span>
              <div className="flex flex-col">
                {/* Topic tag name */}
                <span className="text-[13px] font-medium text-neutral-700 group-hover:text-primary transition-all">
                  #{topic.tag}
                </span>
                {/* Voices count */}
                <span className="text-[10px] text-neutral-400">
                  {topic.count} voices
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 4: Live stats bar */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-3 flex items-center justify-around text-center">
        {/* Live now */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[15px] font-medium text-neutral-800 tracking-tight">{liveNow}</span>
          </div>
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2px]">live now</span>
        </div>

        {/* Vertical divider */}
        <div className="w-[0.5px] h-8 bg-black/10" />

        {/* Voices today */}
        <div className="flex flex-col items-center">
          <span className="text-[15px] font-medium text-neutral-800 tracking-tight">{voicesToday}</span>
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2px]">voices today</span>
        </div>
      </div>
    </aside>
  );
}
