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

  // Topic Color Mapping
  const topicColors: { [key in Post["tag"]]: { bg: string; text: string } } = {
    politics: { bg: "bg-tag-politics-bg text-tag-politics-text", text: "" },
    education: { bg: "bg-tag-education-bg text-tag-education-text", text: "" },
    jobs: { bg: "bg-tag-jobs-bg text-tag-jobs-text", text: "" },
    society: { bg: "bg-tag-society-bg text-tag-society-text", text: "" },
    culture: { bg: "bg-tag-culture-bg text-tag-culture-text", text: "" },
    environment: { bg: "bg-tag-environment-bg text-tag-environment-text", text: "" },
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
    <article className="w-full bg-brandCard border border-black/10 rounded-card p-4 transition-all hover:border-black/20 flex flex-col gap-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Left: Initials Avatar + Username + Timestamp */}
        <div className="flex items-center gap-2">
          {/* Pastel Initials Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium select-none"
            style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
          >
            {getInitials(post.author)}
          </div>
          {/* Author & Timestamp */}
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-medium text-neutral-800">{post.author}</span>
            <span className="text-[10px] text-neutral-400 mt-0.5">{formatTime(post.ts)}</span>
          </div>
        </div>

        {/* Right: New Badge + Tag Pill */}
        <div className="flex items-center gap-1.5">
          {isPostNew && (
            <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-inner bg-tag-new-bg text-tag-new-text uppercase tracking-wider">
              new
            </span>
          )}
          <span className={`px-2 py-0.5 text-[10px] rounded-pill font-medium uppercase tracking-[0.2px] ${topicColors[post.tag].bg}`}>
            {post.tag}
          </span>
        </div>
      </div>

      {/* Title & Body */}
      <Link to={`/post/${post.id}`} className="group flex flex-col gap-1 cursor-pointer">
        <h3 className="text-[14px] font-medium text-neutral-900 group-hover:text-primary transition-all leading-[1.45]">
          {post.title}
        </h3>
        {post.body && (
          <p className="text-[13px] text-neutral-600 line-clamp-3 leading-relaxed mt-0.5">
            {post.body}
          </p>
        )}
      </Link>

      {/* Footer Row (Reactions & Comments) */}
      <div className="flex items-center justify-between mt-1">
        {/* Left: Reactions */}
        <div className="flex items-center gap-1.5">
          {/* Flame (Fire) */}
          <button
            onClick={() => toggleReaction(post.id, "fire")}
            className={`px-2.5 py-1 rounded-pill border text-[11px] font-medium flex items-center gap-1 transition-all select-none ${
              activeReactions.fire
                ? "bg-reaction-fire-bg border-reaction-fire text-reaction-fire-text"
                : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            <IconFlame size={13} fill={activeReactions.fire ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.fire)}</span>
          </button>

          {/* Heart */}
          <button
            onClick={() => toggleReaction(post.id, "heart")}
            className={`px-2.5 py-1 rounded-pill border text-[11px] font-medium flex items-center gap-1 transition-all select-none ${
              activeReactions.heart
                ? "bg-reaction-heart-bg border-reaction-heart text-reaction-heart-text"
                : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            <IconHeart size={13} fill={activeReactions.heart ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.heart)}</span>
          </button>

          {/* Think (Brain) */}
          <button
            onClick={() => toggleReaction(post.id, "think")}
            className={`px-2.5 py-1 rounded-pill border text-[11px] font-medium flex items-center gap-1 transition-all select-none ${
              activeReactions.think
                ? "bg-reaction-think-bg border-reaction-think text-reaction-think-text"
                : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            <IconBrain size={13} fill={activeReactions.think ? "currentColor" : "none"} stroke={1.8} />
            <span>{formatCount(post.think)}</span>
          </button>
        </div>

        {/* Right: Comment & Share */}
        <div className="flex items-center gap-1 text-neutral-400">
          {/* Comment Count */}
          <Link
            to={`/post/${post.id}`}
            className="p-1 rounded-full hover:bg-neutral-100 hover:text-neutral-700 transition-all flex items-center gap-1"
            title="View comments"
          >
            <IconMessage2 size={15} stroke={1.8} />
            <span className="text-[11px] font-medium">{formatCount(post.comments)}</span>
          </Link>

          {/* Share Deep Link */}
          <button
            onClick={handleShare}
            className="p-1 rounded-full hover:bg-neutral-100 hover:text-neutral-700 transition-all relative flex items-center justify-center"
            title="Copy voice link"
          >
            {copied ? (
              <>
                <IconCheck size={15} stroke={2} className="text-primary-dark" />
                <span className="absolute bottom-full mb-1 px-1.5 py-0.5 text-[9px] bg-neutral-900 text-white rounded font-medium whitespace-nowrap fade-in">
                  copied!
                </span>
              </>
            ) : (
              <IconShare size={15} stroke={1.8} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
