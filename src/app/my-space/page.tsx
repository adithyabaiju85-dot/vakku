"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/StateContext";
import VoiceCard from "@/components/VoiceCard";
import { IconMask, IconFlame, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

type SubTab = "voices" | "reactions";

export default function MySpacePage() {
  const { posts, userReactions, identity } = useAppState();
  const [activeTab, setActiveTab] = useState<SubTab>("voices");

  // Heuristic: user posts start with "post-" (created at runtime), seeds start with "seed-"
  const myPosts = posts.filter((p) => p.id.startsWith("post-"));

  // Reacted posts: check userReactions record
  const myReactedPosts = posts.filter((p) => {
    const rx = userReactions[p.id];
    return rx && (rx.fire || rx.heart || rx.think);
  });

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Session Identity Header */}
      <div className="w-full bg-primary-light border border-primary-border rounded-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-primary-border text-primary-dark">
            <IconMask size={18} stroke={1.8} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-medium text-primary-dark">my temporary space</span>
            <span className="text-[11px] text-primary-dark/80 mt-0.5">
              masked session: <strong className="font-medium">{identity || "anonymous"}</strong>
            </span>
          </div>
        </div>
        
        {/* Dynamic metadata note */}
        <span className="text-[10px] text-primary-dark opacity-80 max-w-[280px] sm:text-right leading-normal">
          This workspace is local to your browser session. Clearing cache will shuffle your space.
        </span>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 select-none border-b border-black/5 pb-1">
        <button
          onClick={() => setActiveTab("voices")}
          className={`px-3 py-1 text-[13px] font-medium transition-all ${
            activeTab === "voices"
              ? "text-primary-dark border-b-2 border-primary font-medium"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          my voices ({myPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("reactions")}
          className={`px-3 py-1 text-[13px] font-medium transition-all ${
            activeTab === "reactions"
              ? "text-primary-dark border-b-2 border-primary font-medium"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          reacted voices ({myReactedPosts.length})
        </button>
      </div>

      {/* Lists rendering based on active tab */}
      <div className="flex flex-col gap-[14px] mt-1">
        {activeTab === "voices" ? (
          myPosts.length > 0 ? (
            myPosts.map((post) => <VoiceCard key={post.id} post={post} />)
          ) : (
            <div className="w-full bg-brandCard border border-black/10 rounded-card p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-black/5 text-neutral-400">
                <IconPlus size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-neutral-600">
                  you haven't spoken yet in this session.
                </span>
                <span className="text-[11px] text-neutral-400 max-w-[280px] mx-auto">
                  Your thoughts represent the real Kerala. Tap below or go back to the feed to speak.
                </span>
              </div>
              <Link to="/" className="px-4 py-1.5 bg-primary text-white text-[12px] rounded-pill font-medium hover:bg-primary-dark active:scale-[0.98] transition-all">
                compose a voice
              </Link>
            </div>
          )
        ) : (
          myReactedPosts.length > 0 ? (
            myReactedPosts.map((post) => <VoiceCard key={post.id} post={post} />)
          ) : (
            <div className="w-full bg-brandCard border border-black/10 rounded-card p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-black/5 text-neutral-400">
                <IconFlame size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-neutral-600">
                  no reactions toggled yet.
                </span>
                <span className="text-[11px] text-neutral-400 max-w-[280px] mx-auto">
                  React to opinions on the feed using Fire, Heart, or Think. They will appear here instantly.
                </span>
              </div>
              <Link to="/" className="px-4 py-1.5 bg-primary text-white text-[12px] rounded-pill font-medium hover:bg-primary-dark active:scale-[0.98] transition-all">
                explore feed
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
