"use client";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppState } from "@/context/StateContext";
import { getInitials, getColorPairForName } from "@/utils/identity";
import {
  IconFlame,
  IconHeart,
  IconBrain,
  IconArrowLeft,
  IconMessage2,
  IconSend,
  IconMask,
  IconCheck,
  IconShare
} from "@tabler/icons-react";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const { posts, comments, addComment, toggleReaction, userReactions, isLoading } = useAppState();
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const post = posts.find((p) => p.id === postId);
  const postComments = comments[postId] || [];
  const activeReactions = userReactions[postId] || { fire: false, heart: false, think: false };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(postId, commentText);
    setCommentText("");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Check if post was created less than 2 hours ago
  const isPostNew = post ? (post.isNew || (Date.now() - post.ts) < 2 * 3600000) : false;

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

  if (isLoading) {
    return (
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-6 animate-pulse flex flex-col gap-4">
        <div className="h-4 w-20 bg-neutral-200 rounded" />
        <div className="h-6 w-3/4 bg-neutral-200 rounded" />
        <div className="h-20 w-full bg-neutral-200 rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col gap-4 fade-in">
        <Link to="/" className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-neutral-700 transition-all select-none">
          <IconArrowLeft size={13} />
          <span>back to feed</span>
        </Link>
        <div className="w-full bg-brandCard border border-black/10 rounded-card p-8 text-center flex flex-col items-center justify-center gap-3">
          <span className="text-[15px] font-medium text-neutral-800">Voice not found</span>
          <span className="text-[12px] text-neutral-400">
            This voice may have shuffeled away or does not exist.
          </span>
          <Link to="/" className="px-4 py-1.5 bg-primary text-white text-[12px] rounded-pill font-medium hover:bg-primary-dark">
            go home
          </Link>
        </div>
      </div>
    );
  }

  const avatarStyle = getColorPairForName(post.author);

  const topicColors: { [key in typeof post.tag]: { bg: string; text: string } } = {
    politics: { bg: "bg-tag-politics-bg text-tag-politics-text", text: "" },
    education: { bg: "bg-tag-education-bg text-tag-education-text", text: "" },
    jobs: { bg: "bg-tag-jobs-bg text-tag-jobs-text", text: "" },
    society: { bg: "bg-tag-society-bg text-tag-society-text", text: "" },
    culture: { bg: "bg-tag-culture-bg text-tag-culture-text", text: "" },
    environment: { bg: "bg-tag-environment-bg text-tag-environment-text", text: "" },
  };

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-all select-none self-start"
      >
        <IconArrowLeft size={14} />
        <span>back to feed</span>
      </Link>

      {/* Main post body card */}
      <article className="w-full bg-brandCard border border-black/10 rounded-card p-5 flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          {/* Left: Initials Avatar + Username + Timestamp */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium select-none"
              style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
            >
              {getInitials(post.author)}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-medium text-neutral-800">{post.author}</span>
              <span className="text-[11px] text-neutral-400 mt-0.5">{formatTime(post.ts)}</span>
            </div>
          </div>

          {/* Right: New Badge + Tag Pill */}
          <div className="flex items-center gap-2">
            {isPostNew && (
              <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-inner bg-tag-new-bg text-tag-new-text uppercase tracking-wider">
                new
              </span>
            )}
            <span className={`px-2.5 py-0.5 text-[11px] rounded-pill font-medium uppercase tracking-[0.2px] ${topicColors[post.tag].bg}`}>
              {post.tag}
            </span>
          </div>
        </div>

        {/* Title & Body */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[16px] font-medium text-neutral-900 leading-[1.45]">
            {post.title}
          </h1>
          {post.body && (
            <p className="text-[14px] text-neutral-700 leading-relaxed whitespace-pre-wrap mt-1">
              {post.body}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-[0.5px] bg-black/5 my-0.5" />

        {/* Footer Row (Reactions & Share) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Flame (Fire) */}
            <button
              onClick={() => toggleReaction(post.id, "fire")}
              className={`px-3 py-1.5 rounded-pill border text-[12px] font-medium flex items-center gap-1.5 transition-all select-none ${
                activeReactions.fire
                  ? "bg-reaction-fire-bg border-reaction-fire text-reaction-fire-text"
                  : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
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
                  ? "bg-reaction-heart-bg border-reaction-heart text-reaction-heart-text"
                  : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
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
                  ? "bg-reaction-think-bg border-reaction-think text-reaction-think-text"
                  : "bg-white border-black/5 text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <IconBrain size={14} fill={activeReactions.think ? "currentColor" : "none"} stroke={1.8} />
              <span>{formatCount(post.think)}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-pill border border-black/5 bg-white text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 text-[12px] font-medium flex items-center gap-1.5 relative"
            title="Copy post link"
          >
            {copied ? (
              <>
                <IconCheck size={14} stroke={2} className="text-primary-dark" />
                <span>copied link!</span>
              </>
            ) : (
              <>
                <IconShare size={14} stroke={1.8} />
                <span>share voice</span>
              </>
            )}
          </button>
        </div>
      </article>

      {/* Dynamic comments sub-panel */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px]">
          <IconMessage2 size={13} />
          <span>discussion ({postComments.length})</span>
        </div>

        {/* Comment composing form */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          {/* Active identity avatar (visual indicator) */}
          <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary-dark shrink-0">
            <IconMask size={16} stroke={1.8} />
          </div>

          {/* Comment text box */}
          <div className="flex-1 flex gap-1.5 items-center relative">
            <input
              type="text"
              placeholder="write an anonymous comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full text-[13px] bg-brandBg border border-black/10 rounded-pill px-4 py-2 outline-none placeholder-neutral-400 text-neutral-800 focus:border-primary/40 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`p-2 rounded-full absolute right-1 transition-all ${
                commentText.trim()
                  ? "bg-primary text-white hover:bg-primary-dark cursor-pointer active:scale-95"
                  : "bg-transparent text-neutral-300 cursor-not-allowed"
              }`}
            >
              <IconSend size={12} stroke={2} />
            </button>
          </div>
        </form>

        {/* Divider */}
        {postComments.length > 0 && <div className="w-full h-[0.5px] bg-black/5" />}

        {/* Comments Feed list */}
        <div className="flex flex-col gap-4">
          {postComments.length > 0 ? (
            [...postComments].sort((a,b) => b.ts - a.ts).map((comment) => {
              const commentAvStyle = getColorPairForName(comment.author);
              return (
                <div key={comment.id} className="flex gap-2.5 items-start fade-in text-[13px]">
                  {/* Initials Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium select-none shrink-0"
                    style={{ backgroundColor: commentAvStyle.bg, color: commentAvStyle.text }}
                  >
                    {getInitials(comment.author)}
                  </div>
                  {/* Body details */}
                  <div className="flex-1 flex flex-col bg-brandBg/40 border border-black/5 rounded-[12px] p-2.5 leading-relaxed">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-medium text-neutral-600">
                        {comment.author}
                      </span>
                      <span className="text-[9px] text-neutral-400">
                        {formatTime(comment.ts)}
                      </span>
                    </div>
                    <p className="text-neutral-700 mt-0.5 text-[13px]">{comment.body}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-neutral-400 text-[12px]">
              be the first to respond to this voice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
