"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/context/StateContext";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import { playClickSound } from "@/utils/audio";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { setIsSettingsOpen } = useAppState();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      playClickSound();
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
    <header className="sticky top-0 z-40 w-full h-[60px] glass-card flex items-center justify-between px-5 select-none rounded-b-2xl mb-4">
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2">
        <Link 
          to="/" 
          onClick={() => playClickSound()}
          className="text-[20px] font-bold tracking-[-0.5px] text-white"
        >
          vaakku<span className="text-primary font-bold neon-text">.</span>
        </Link>
      </div>

      {/* Centre: Nav Chips */}
      <nav className="hidden md:flex items-center gap-2 p-1 rounded-pill border border-white/10 bg-white/5">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => playClickSound()}
              className={`px-4 py-1.5 text-[13px] rounded-pill font-bold uppercase tracking-[1px] transition-all ${
                isActive
                  ? "bg-primary text-[#000000] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "text-neutral-500 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Search & Settings */}
      <div className="flex items-center gap-3">
        
        {/* Settings Icon (New) */}
        <button
          onClick={() => { playClickSound(); setIsSettingsOpen(true); }}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] active:scale-[0.95]"
          title="Settings"
        >
          <IconSettings size={18} stroke={1.5} />
        </button>

        {/* Search Input Toggle */}
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="relative flex items-center fade-in">
            <input
              type="text"
              placeholder="search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 pr-8 text-[12px] bg-black/80 border border-primary/50 rounded-pill outline-none w-[140px] md:w-[200px] text-white placeholder-neutral-500 shadow-[0_0_15px_rgba(0,229,255,0.2)] focus:border-primary transition-all font-bold"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setTimeout(() => setShowSearch(false), 200);
              }}
            />
            <button type="submit" className="absolute right-3 text-primary hover:text-white transition-colors">
              <IconSearch size={16} stroke={2} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => { playClickSound(); setShowSearch(true); }}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] active:scale-[0.95]"
            title="Search posts"
          >
            <IconSearch size={18} stroke={1.5} />
          </button>
        )}
      </div>
    </header>
  );
}
