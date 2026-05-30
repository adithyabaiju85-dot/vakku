"use client";

import React from "react";
import { useAppState, Post } from "@/context/StateContext";
import { IconMask, IconBroadcast, IconTrendingUp, IconChartPie } from "@tabler/icons-react";

export default function Sidebar() {
  const { posts, liveNow, voicesToday } = useAppState();

  // 1. Dynamic Mood Aggregation for Today's Pulse (only real broadcasts)
  const moodCounts = { frustrated: 0, hopeful: 0, confused: 0, proud: 0, serious: 0 };
  posts.forEach((p) => {
    if (p.mood in moodCounts) {
      moodCounts[p.mood as keyof typeof moodCounts]++;
    }
  });

  const totalMoods = posts.length || 1;
  const moodPercentages = {
    frustrated: totalMoods > 0 ? Math.round((moodCounts.frustrated / totalMoods) * 100) : 0,
    hopeful: totalMoods > 0 ? Math.round((moodCounts.hopeful / totalMoods) * 100) : 0,
    confused: totalMoods > 0 ? Math.round((moodCounts.confused / totalMoods) * 100) : 0,
    proud: totalMoods > 0 ? Math.round((moodCounts.proud / totalMoods) * 100) : 0,
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

  // Convert topic counts to array and sort descending
  const aggregatedTopics = Object.entries(topicCounts).map(([tag, count]) => ({
    tag: tag as Post["tag"],
    count,
  }));

  const sortedTopics = [...aggregatedTopics].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <aside className="w-full flex flex-col gap-4 text-[13px]">
      {/* Widget 1: You are masked card */}
      <div className="w-full glass-card border border-white/10 rounded-[24px] p-5 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-primary font-bold">
          <IconMask size={16} stroke={2} />
          <span className="text-[12px] tracking-[0.5px] uppercase">you are masked</span>
        </div>
        <p className="text-[12px] leading-relaxed text-neutral-400">
          No name. No face. Your identity shuffles every visit. Just your words.
        </p>
      </div>

      {/* Widget 2: Today's Pulse */}
      <div className="w-full glass-card border border-white/10 rounded-[24px] p-5 flex flex-col gap-3">
        <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.5px] flex items-center gap-1">
          <IconChartPie size={12} />
          <span>today's pulse</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {pulseBars.map((bar) => (
            <div key={bar.label} className="flex items-center justify-between text-[11px]">
              {/* Label */}
              <span className="w-[85px] text-neutral-400 font-bold uppercase tracking-[1px] text-[10px]">{bar.label}</span>
              {/* Thin progress bar */}
              <div className="flex-1 h-[4px] bg-white/5 rounded-full overflow-hidden mx-2 shadow-inner">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${bar.percentage}%` }}
                />
              </div>
              {/* Percentage */}
              <span className="text-white font-bold text-right w-[28px]">{bar.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Being Talked About (Trending) */}
      <div className="w-full glass-card border border-white/10 rounded-[24px] p-5 flex flex-col gap-3">
        <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.5px] flex items-center gap-1">
          <IconTrendingUp size={12} />
          <span>being talked about</span>
        </div>
        <div className="flex flex-col gap-3">
          {sortedTopics.map((topic, index) => (
            <div key={topic.tag} className="flex items-center gap-3 group cursor-pointer">
              {/* Muted Rank Number */}
              <span className="text-[18px] font-bold text-neutral-600 leading-none group-hover:text-primary transition-colors">
                {index + 1}
              </span>
              <div className="flex flex-col">
                {/* Topic tag name */}
                <span className="text-[13px] font-bold text-white group-hover:text-primary transition-all">
                  #{topic.tag}
                </span>
                {/* Voices count */}
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.5px]">
                  {topic.count} voices
                </span>
              </div>
            </div>
          ))}
          {sortedTopics.length === 0 && (
            <span className="text-[12px] text-neutral-600 italic">No trending topics yet.</span>
          )}
        </div>
      </div>

      {/* Widget 4: Live stats bar */}
      <div className="w-full glass-card border border-white/10 rounded-[24px] p-4 flex items-center justify-around text-center">
        {/* Live now */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping" />
            <span className="text-[18px] font-bold text-white tracking-tight">{liveNow}</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[1px]">live now</span>
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-8 bg-white/10" />

        {/* Voices today */}
        <div className="flex flex-col items-center">
          <span className="text-[18px] font-bold text-white tracking-tight">{voicesToday}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[1px]">voices today</span>
        </div>
      </div>
    </aside>
  );
}
