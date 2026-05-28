"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/context/StateContext";
import { IconRefresh, IconSearch } from "@tabler/icons-react";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { identity, shuffleIdentity } = useAppState();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleShuffle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSpinning(true);
    shuffleIdentity();
    setTimeout(() => setIsSpinning(false), 600);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trending?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const navItems = [
    { label: "feed", path: "/" },
    { label: "trending", path: "/trending" },
    { label: "pulse", path: "/pulse" },
    { label: "my space", path: "/my-space" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-[52px] bg-brandCard border-b border-black/10 flex items-center justify-between px-5 select-none">
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2">
        <Link to="/" className="text-[19px] font-medium tracking-[-0.5px] text-black">
          vaakku<span className="text-primary font-medium">.</span>
        </Link>
      </div>

      {/* Centre: Nav Chips */}
      <nav className="hidden md:flex items-center gap-1.5 bg-brandBg/60 p-0.5 rounded-pill border border-black/5">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1 text-[13px] rounded-pill font-medium transition-all ${
                isActive
                  ? "bg-primary-light text-primary-dark font-medium"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Search & Identity Pill */}
      <div className="flex items-center gap-2">
        {/* Search Input Toggle */}
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="relative flex items-center fade-in">
            <input
              type="text"
              placeholder="search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 pr-7 text-[12px] bg-brandBg border border-black/10 rounded-pill outline-none w-[140px] md:w-[180px]"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setTimeout(() => setShowSearch(false), 200);
              }}
            />
            <button type="submit" className="absolute right-2 text-neutral-400 hover:text-neutral-700">
              <IconSearch size={14} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
            title="Search posts"
          >
            <IconSearch size={15} stroke={1.8} />
          </button>
        )}

        {/* Identity Pill */}
        <div
          onClick={handleShuffle}
          className="flex items-center gap-2 px-3 py-1 bg-brandBg border border-black/5 rounded-pill cursor-pointer hover:bg-neutral-100 group active:scale-[0.98] transition-all max-w-[170px] md:max-w-none"
          title="Shuffle Identity"
        >
          {/* Active status indicator */}
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />

          {/* User Name */}
          <span className="text-[12px] font-medium text-neutral-700 truncate max-w-[90px] md:max-w-[140px]">
            {identity || "loading..."}
          </span>

          {/* Shuffle Icon */}
          <IconRefresh
            size={13}
            stroke={2}
            className={`text-neutral-400 group-hover:text-primary transition-all ${
              isSpinning ? "animate-spin text-primary" : ""
            }`}
          />
        </div>
      </div>
    </header>
  );
}
