import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppState } from "@/context/StateContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Onboarding from "@/components/Onboarding";
import SettingsModal from "@/components/SettingsModal";
import DeveloperModal from "@/components/DeveloperModal";
import { playAnnouncementSound } from "@/utils/audio";

// Page imports from our app directory structure
import FeedPage from "./app/page";
import PostDetailPage from "./app/post/[id]/page";
import TrendingPage from "./app/trending/page";
import PulsePage from "./app/pulse/page";
import MySpacePage from "./app/my-space/page";

export default function App() {
  const { hasOnboarded, isLoading } = useAppState();
  const [lastAnnouncementId, setLastAnnouncementId] = useState<string | null>(null);

  // Listen for announcement notifications
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaakku_announcement_trigger" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          // Only play sound if this is a new announcement (not the one we just posted)
          if (data.id !== lastAnnouncementId) {
            playAnnouncementSound();
            setLastAnnouncementId(data.id);
          }
        } catch (err) {
          console.error("Failed to parse announcement trigger", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [lastAnnouncementId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brandBg flex items-center justify-center select-none animate-pulse">
        <span className="text-[20px] font-medium tracking-tight text-neutral-400">
          initializing vaakku<span className="text-primary font-medium neon-text">.</span>
        </span>
      </div>
    );
  }

  return (
    <Router>
      {/* Global Modals */}
      <SettingsModal />
      <DeveloperModal />
      
      {/* First Phase: if they haven't onboarded, enforce onboarding name selection & purpose description */}
      {!hasOnboarded && <Onboarding />}

      <div className="bg-brandBg text-neutral-200 antialiased min-h-screen flex flex-col font-sans relative overflow-hidden">
        
        {/* CGI Aurora Background */}
        <div className="aurora-bg" />
        
        {/* Sticky Navbar (52px tall) */}
        {hasOnboarded && <Navbar />}

        {/* Responsive Centered Layout Container */}
        <main className="flex-1 w-full max-w-[960px] mx-auto px-5 py-[14px] relative z-10">
          {/* Two column layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-[14px]">
            
            {/* Left column: Dynamic route renders here */}
            <div className="flex flex-col gap-4 min-w-0">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/pulse" element={<PulsePage />} />
                <Route path="/my-space" element={<MySpacePage />} />
              </Routes>
            </div>

            {/* Right column: Sidebar (hidden on mobile, blocks at lg desktop width) */}
            <div className="hidden lg:block w-[200px] shrink-0">
              <Sidebar />
            </div>

          </div>
        </main>
      </div>
    </Router>
  );
}

