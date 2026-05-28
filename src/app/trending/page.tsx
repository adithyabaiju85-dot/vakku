"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppState, Post } from "@/context/StateContext";
import VoiceCard from "@/components/VoiceCard";
import { IconSearch, IconTrendingUp, IconHash, IconX } from "@tabler/icons-react";

export default function TrendingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("q") || "";

  const { posts } = useAppState();
  const [searchVal, setSearchVal] = useState(queryParam);
  const [selectedTopic, setSelectedTopic] = useState<Post["tag"] | "all">("all");

  // Keep search input synced with URL
  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/trending?q=${encodeURIComponent(searchVal.trim())}`);
      setSelectedTopic("all"); // Reset topic when searching text
    } else {
      navigate("/trending");
    }
  };

  const clearSearch = () => {
    setSearchVal("");
    navigate("/trending");
  };

  // Get counts per topic dynamically
  const topicCounts: { [key in Post["tag"]]?: number } = {};
  posts.forEach((p) => {
    topicCounts[p.tag] = (topicCounts[p.tag] || 0) + 1;
  });

  const baseTopics: { tag: Post["tag"]; label: string; base: number; colorClass: string }[] = [
    { tag: "jobs", label: "jobs & careers", base: 142, colorClass: "bg-tag-jobs-bg text-tag-jobs-text border-tag-jobs-text/10" },
    { tag: "society", label: "social issues", base: 119, colorClass: "bg-tag-society-bg text-tag-society-text border-tag-society-text/10" },
    { tag: "education", label: "education system", base: 88, colorClass: "bg-tag-education-bg text-tag-education-text border-tag-education-text/10" },
    { tag: "politics", label: "local politics", base: 75, colorClass: "bg-tag-politics-bg text-tag-politics-text border-tag-politics-text/10" },
    { tag: "environment", label: "climate & nature", base: 54, colorClass: "bg-tag-environment-bg text-tag-environment-text border-tag-environment-text/10" },
    { tag: "culture", label: "arts & lifestyle", base: 42, colorClass: "bg-tag-culture-bg text-tag-culture-text border-tag-culture-text/10" },
  ];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Topic filter
    if (selectedTopic !== "all" && post.tag !== selectedTopic) {
      return false;
    }
    // Search query filter
    if (queryParam.trim()) {
      const q = queryParam.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchBody = post.body.toLowerCase().includes(q);
      const matchTag = post.tag.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      return matchTitle || matchBody || matchTag || matchAuthor;
    }
    return true;
  });

  // Sort by Hot score
  const calculateHotScore = (post: Post) => {
    return (post.fire * 1.5) + post.heart + post.think + (post.comments * 2);
  };
  const sortedPosts = [...filteredPosts].sort((a, b) => calculateHotScore(b) - calculateHotScore(a));

  return (
    <div className="flex flex-col gap-4 fade-in">
      {/* Search Header widget */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px]">
          <IconSearch size={13} />
          <span>explore topics and voices</span>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="search keywords, topics, or authors..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full text-[13px] bg-brandBg border border-black/10 rounded-pill px-4 py-2.5 pl-10 pr-10 outline-none text-neutral-800 focus:border-primary/40 focus:bg-white"
          />
          <IconSearch size={16} stroke={1.8} className="absolute left-3.5 text-neutral-400" />
          {searchVal && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition-all p-0.5 rounded-full hover:bg-neutral-100"
            >
              <IconX size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Grid of Trending Topics */}
      <div className="w-full bg-brandCard border border-black/10 rounded-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px] select-none">
          <IconTrendingUp size={13} />
          <span>trending categories</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 select-none">
          {baseTopics.map((topic) => {
            const isSelected = selectedTopic === topic.tag;
            const activeCount = topicCounts[topic.tag] || 0;
            const totalCount = topic.base + activeCount;

            return (
              <div
                key={topic.tag}
                onClick={() => {
                  setSelectedTopic(isSelected ? "all" : topic.tag);
                  if (queryParam) clearSearch(); // Clear search query when selecting topic
                }}
                className={`border rounded-[12px] p-2.5 cursor-pointer flex flex-col gap-1 transition-all active:scale-[0.98] ${topic.colorClass} ${
                  isSelected
                    ? "ring-2 ring-primary border-transparent scale-[1.01]"
                    : "hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium tracking-tight">#{topic.tag}</span>
                  <IconHash size={11} className="opacity-60" />
                </div>
                <span className="text-[10px] font-medium opacity-85">
                  {totalCount} voices today
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore results heading */}
      <div className="flex items-center justify-between mt-1 select-none">
        <h2 className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.5px]">
          {queryParam.trim() ? (
            <span>search results for "{queryParam}"</span>
          ) : selectedTopic !== "all" ? (
            <span>voices in #{selectedTopic}</span>
          ) : (
            <span>trending right now</span>
          )}
        </h2>
        <span className="text-[10px] text-neutral-400 font-medium uppercase">
          {sortedPosts.length} {sortedPosts.length === 1 ? "voice" : "voices"} match
        </span>
      </div>

      {/* Results Feed */}
      <div className="flex flex-col gap-[14px]">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <VoiceCard key={post.id} post={post} />)
        ) : (
          <div className="w-full bg-brandCard border border-black/10 rounded-card p-8 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-[14px] font-medium text-neutral-600">
              no matches found.
            </span>
            <span className="text-[11px] text-neutral-400">
              Try searching a different keyword or checking another category tab.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
