"use client";

import React from "react";
import { useAppState, Post } from "@/context/StateContext";
import { IconFlame, IconSun, IconMoodConfuzed, IconHeart, IconAlertTriangle, IconChartBar, IconInfoCircle } from "@tabler/icons-react";

export default function PulsePage() {
  const { posts } = useAppState();

  // Aggregate stats per mood
  const stats = {
    frustrated: { count: 0, reactions: 0, comments: 0 },
    hopeful: { count: 0, reactions: 0, comments: 0 },
    confused: { count: 0, reactions: 0, comments: 0 },
    proud: { count: 0, reactions: 0, comments: 0 },
    serious: { count: 0, reactions: 0, comments: 0 },
  };

  posts.forEach((p) => {
    const m = p.mood;
    if (m in stats) {
      stats[m as keyof typeof stats].count++;
      stats[m as keyof typeof stats].reactions += p.fire + p.heart + p.think;
      stats[m as keyof typeof stats].comments += p.comments;
    }
  });

  const totalVoices = posts.length || 1;

  // Calculate percentages (smoothed with base values to ensure nice visual graphs even with 0 custom posts)
  const baseCounts = { frustrated: 58, hopeful: 34, confused: 26, proud: 41, serious: 49 };
  
  const formattedStats = (Object.keys(stats) as Array<keyof typeof stats>).map((key) => {
    const activeCount = stats[key].count;
    const totalRepresentedCount = baseCounts[key] + activeCount;
    return {
      key,
      label: key,
      representedCount: totalRepresentedCount,
      activeCount,
      reactions: stats[key].reactions,
      comments: stats[key].comments,
    };
  });

  // Calculate percentage of total represented
  const totalRepresentedAll = formattedStats.reduce((sum, item) => sum + item.representedCount, 0) || 1;
  const statsWithPercent = formattedStats.map((item) => ({
    ...item,
    percentage: Math.round((item.representedCount / totalRepresentedAll) * 100),
  }));

  // Find dominant mood
  const dominantMood = [...statsWithPercent].sort((a, b) => b.representedCount - a.representedCount)[0];

  // Visual variables mapping
  const moodMeta: {
    [key in Post["mood"]]: {
      color: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ReactNode;
      description: string;
    };
  } = {
    frustrated: {
      color: "bg-reaction-fire",
      bg: "bg-reaction-fire-bg",
      text: "text-reaction-fire-text",
      border: "border-reaction-fire/20",
      icon: <IconFlame size={18} className="text-reaction-fire-text" />,
      description: "Anger, venting, and frustrations about systemic issues like job markets and societal pressures.",
    },
    hopeful: {
      color: "bg-[#5DCAA5]",
      bg: "bg-[#E1F5EE]",
      text: "text-[#0F6E56]",
      border: "border-[#9FE1CB]/40",
      icon: <IconSun size={18} className="text-[#0F6E56]" />,
      description: "Optimistic views, solutions, and positive change stories within the community.",
    },
    confused: {
      color: "bg-reaction-think",
      bg: "bg-reaction-think-bg",
      text: "text-reaction-think-text",
      border: "border-reaction-think/20",
      icon: <IconMoodConfuzed size={18} className="text-reaction-think-text" />,
      description: "Dilemmas, questions, and confusion regarding relationships, career pivots, or family expectations.",
    },
    proud: {
      color: "bg-reaction-heart",
      bg: "bg-reaction-heart-bg",
      text: "text-reaction-heart-text",
      border: "border-reaction-heart/20",
      icon: <IconHeart size={18} className="text-reaction-heart-text" />,
      description: "Moments of pride in our culture, state achievements, or personal small wins.",
    },
    serious: {
      color: "bg-[#ED8362]",
      bg: "bg-[#FCF1ED]",
      text: "text-[#9E3E1B]",
      border: "border-[#ED8362]/20",
      icon: <IconAlertTriangle size={18} className="text-[#9E3E1B]" />,
      description: "Sober discussions, public policy critiques, and environmental calls to action.",
    },
  };

  // Custom advisory based on dominant vibe
  const getVibeCheckCard = (moodKey: Post["mood"]) => {
    switch (moodKey) {
      case "frustrated":
        return {
          title: "frustration is running hot today.",
          body: "Many voices are currently expressing frustration regarding jobs, rigid systems, and mental health barriers. Remember, speaking out is the first step toward collective release. You are not alone in feeling this way.",
          bg: "bg-reaction-fire-bg text-reaction-fire-text border-reaction-fire/30",
        };
      case "hopeful":
        return {
          title: "hope is carrying the community today.",
          body: "A wave of optimism is currently prevailing. Voices are sharing solutions, creative wins, and visions for a brighter state. Ride this energy!",
          bg: "bg-primary-light text-primary-dark border-primary-border/40",
        };
      case "confused":
        return {
          title: "confusion is dominant today.",
          body: "Many peers are feeling stuck, asking questions about life paths and career decisions. Seeking clarity together is healthy. Share your guidance in comments!",
          bg: "bg-reaction-think-bg text-reaction-think-text border-reaction-think/30",
        };
      case "proud":
        return {
          title: "pride is overflowing today.",
          body: "Malayali youth are actively celebrating our culture, local arts, and community resilience. Keep uplifting each other and preserving what matters.",
          bg: "bg-reaction-heart-bg text-reaction-heart-text border-reaction-heart/30",
        };
      default:
        return {
          title: "conversations are intense and serious today.",
          body: "Analytical and deep discussions regarding state politics, environment, and educational reforms are driving the feed. Let's keep the critique constructive and deep.",
          bg: "bg-[#FCF1ED] text-[#9E3E1B] border-[#ED8362]/20",
        };
    }
  };

  const vibeAdvisory = getVibeCheckCard(dominantMood.key);

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Dynamic Vibe check Summary */}
      <div className={`w-full border rounded-card p-4 flex flex-col gap-2 transition-all ${vibeAdvisory.bg}`}>
        <div className="flex items-center gap-1.5 font-medium text-[12px] uppercase tracking-wider">
          <IconInfoCircle size={15} />
          <span>vibe check</span>
        </div>
        <h2 className="text-[15px] font-medium leading-[1.4]">{vibeAdvisory.title}</h2>
        <p className="text-[12px] leading-relaxed opacity-95">{vibeAdvisory.body}</p>
      </div>

      {/* Analytics Dashboard Panel */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px] select-none">
          <IconChartBar size={13} />
          <span>community emotional volumes</span>
        </div>

        {/* Detailed Stats Row List */}
        <div className="flex flex-col gap-3.5 select-none">
          {statsWithPercent
            .sort((a, b) => b.representedCount - a.representedCount)
            .map((item) => {
              const meta = moodMeta[item.key];
              return (
                <div
                  key={item.key}
                  className={`border rounded-card p-3.5 flex flex-col gap-2 transition-all ${meta.bg} ${meta.border}`}
                >
                  {/* Top line: icon, label, percentage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-black/5">
                        {meta.icon}
                      </div>
                      <span className={`text-[13px] font-medium uppercase tracking-wider ${meta.text}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-[18px] font-medium ${meta.text}`}>{item.percentage}%</span>
                  </div>

                  {/* Description text */}
                  <p className="text-[12px] text-neutral-600 leading-relaxed mt-0.5">
                    {meta.description}
                  </p>

                  {/* Progress bar container */}
                  <div className="w-full h-2.5 bg-white/60 border border-black/5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${meta.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {/* Micro stats footer */}
                  <div className="flex items-center gap-4 text-[10px] text-neutral-400 mt-0.5 font-medium uppercase">
                    <span>{item.representedCount} voices total</span>
                    {item.activeCount > 0 && (
                      <span className={meta.text}>+{item.activeCount} added by you</span>
                    )}
                    <span>{item.reactions} reactions toggled</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
