"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Post, useAppState } from "@/context/StateContext";
import { getInitials, getColorPairForName } from "@/utils/identity";
import { IconFlame, IconHeart, IconBrain, IconMessage2, IconShare, IconCheck } from "@tabler/icons-react";

interface VoiceCardProps {
  post: Post;
}

export default function VoiceCard({ post }: VoiceCardProps) {
  const { toggleReaction, userReactions } = useAppState();
  const [copied, setCopied] = useState(false);

  // Check if post was created less than 2 hours ago
  const isPostNew = post.isNew || (Date.now() - post.ts) < 2 * 3600000;

  // Format time ago
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "just now";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  };

  // Format count (e.g. 1200 -> 1.2k)
  const formatCount = (count: number) => {
    if (count < 1000) return count.toString();
    return `${(count / 1000).toFixed(1)}k`;
  };

  const avatarStyle = getColorPairForName(post.author);
  const activeReactions = userReactions[post.id] || { fire: false, heart: false, think: false };

  // Topic Color Mapping (Updated for dark mode)
  const topicColors: { [key in Post["tag"]]: { bg: string; text: string } } = {
    politics: { bg: "bg-tag-politics-bg text-tag-politics-text border border-tag-politics-text/20", text: "" },
    education: { bg: "bg-tag-education-bg text-tag-education-text border border-tag-education-text/20", text: "" },
    jobs: { bg: "bg-tag-jobs-bg text-tag-jobs-text border border-tag-jobs-text/20", text: "" },
    society: { bg: "bg-tag-society-bg text-tag-society-text border border-tag-society-text/20", text: "" },
    culture: { bg: "bg-tag-culture-bg text-tag-culture-text border border-tag-culture-text/20", text: "" },
    environment: { bg: "bg-tag-environment-bg text-tag-environment-text border border-tag-environment-text/20", text: "" },
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="w-full glass-card rounded-card p-5 transition-all hover:-translate-y-1 flex flex-col gap-4 relative overflow-hidden group">
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10">
        {/* Left: Initials Avatar + Username + Timestamp */}
        <div className="flex items-center gap-3">
          {/* Pastel Initials Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold select-none shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/10"
            style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
          >
            {getInitials(post.author)}
          </div>
          {/* Author & Timestamp */}
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-bold text-neutral-100">{post.author}</span>
            <span className="text-[11px] text-neutral-400 mt-1">{formatTime(post.ts)}</span>
          </div>
        </div>

        {/* Right: New Badge + Tag Pill */}
        <div className="flex items-center gap-2">
          {isPostNew && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-inner bg-primary text-black uppercase tracking-wider shadow-[0_0_8px_rgba(0,229,255,0.5)]">
              new
            </span>
          )}
          <span className={`px-2.5 py-1 text-[10px] rounded-pill font-bold uppercase tracking-[0.5px] ${topicColors[post.tag].bg}`}>
            {post.tag}
          </span>
        </div>
      </div>

      {/* Title & Body */}
      <Link to={`/post/${post.id}`} className="flex flex-col gap-2 cursor-pointer relative z-10 mt-1">
        <h3 className="text-[16px] font-bold text-white group-hover:text-primary transition-colors leading-[1.4] tracking-tight">
          {post.title}
        </h3>
        {post.body && (
          <p className="text-[14px] text-neutral-300 line-clamp-3 leading-relaxed">
            {post.body}
          </p>
        )}
      </Link>

      {/* Footer Row (Reactions & Comments) */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5 relative z-10">
        {/* Left: Reactions */}
        <div className="flex items-center gap-2">
          {/* Flame (Fire) */}
          <button
            onClick={() => toggleReaction(post.id, "fire")}
            className={`px-3 py-1.5 rounded-pill border text-[12px] font-medium flex items-center gap-1.5 transition-all select-none ${
              activeReactions.fire
                ? "bg-reaction-fire-bg border-reaction-fire/50 text-reaction-fire-text shadow-[0_0_10px_rgba(255,61,0,0.2)] scale-105"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconFlame size={14} fill={activeReactions.fire ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.fire)}</span>
          </button>

          {/* Heart */}
          <button
            onClick={() => toggleReaction(post.id, "heart")}
            className={`px-3 py-1.5 rounded-pill border text-[12px] font-medium flex items-center gap-1.5 transition-all select-none ${
              activeReactions.heart
                ? "bg-reaction-heart-bg border-reaction-heart/50 text-reaction-heart-text shadow-[0_0_10px_rgba(245,0,87,0.2)] scale-105"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconHeart size={14} fill={activeReactions.heart ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.heart)}</span>
          </button>

          {/* Think (Brain) */}
          <button
            onClick={() => toggleReaction(post.id, "think")}
            className={`px-3 py-1.5 rounded-pill border text-[12px] font-medium flex items-center gap-1.5 transition-all select-none ${
              activeReactions.think
                ? "bg-reaction-think-bg border-reaction-think/50 text-reaction-think-text shadow-[0_0_10px_rgba(213,0,249,0.2)] scale-105"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconBrain size={14} fill={activeReactions.think ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.think)}</span>
          </button>
        </div>

        {/* Right: Comment & Share */}
        <div className="flex items-center gap-2 text-neutral-400">
          {/* Comment Count */}
          <Link
            to={`/post/${post.id}`}
            className="p-1.5 rounded-full hover:bg-white/10 hover:text-primary transition-colors flex items-center gap-1.5"
            title="View comments"
          >
            <IconMessage2 size={16} stroke={1.8} />
            <span className="text-[12px] font-medium">{formatCount(post.comments)}</span>
          </Link>

          {/* Share Deep Link */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-white/10 hover:text-primary transition-colors relative flex items-center justify-center"
            title="Copy voice link"
          >
            {copied ? (
              <>
                <IconCheck size={16} stroke={2} className="text-primary" />
                <span className="absolute bottom-full mb-2 px-2 py-1 text-[10px] bg-primary text-black rounded font-bold whitespace-nowrap fade-in shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  copied!
                </span>
              </>
            ) : (
              <IconShare size={16} stroke={1.8} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
