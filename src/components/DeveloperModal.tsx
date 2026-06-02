"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/StateContext";
import { IconX, IconShieldLock, IconUsers, IconActivity, IconBroadcast, IconChartBar, IconRefresh, IconTrash, IconEye, IconEyeOff, IconEdit } from "@tabler/icons-react";
import { playClickSound } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";

export default function DeveloperModal() {
  const { 
    isDeveloperModalOpen, 
    setIsDeveloperModalOpen, 
    activeUsers,
    isDeveloper,
    identity,
    setOnboarded,
    posts,
    voicesToday,
    deleteComment,
    hidePost,
    unhidePost,
    hiddenPosts,
    deletePost
  } = useAppState();

  const [devName, setDevName] = useState(identity);
  const [devAlias, setDevAlias] = useState<string>(localStorage.getItem('vaakku_dev_alias') || '');
  const [liveTyping, setLiveTyping] = React.useState<{author: string, text: string, ts: number} | null>(null);

  React.useEffect(() => {
    if (!isDeveloper || !isDeveloperModalOpen) return;
    // Load developer alias when modal opens
    const storedAlias = localStorage.getItem('vaakku_dev_alias');
    if (storedAlias) setDevAlias(storedAlias);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaakku_typing_event" && e.newValue) {
        setLiveTyping(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isDeveloper, isDeveloperModalOpen]);

  if (!isDeveloper) return null;

  const handleClose = () => {
    playClickSound();
    setIsDeveloperModalOpen(false);
  };

  const handleNameChange = () => {
    playClickSound();
    if (devName.trim()) {
      setOnboarded(devName.trim());
    }
  };

  const handleAliasChange = () => {
    playClickSound();
    const aliasTrim = devAlias.trim();
    if (aliasTrim) {
      localStorage.setItem('vaakku_dev_alias', aliasTrim);
    } else {
      localStorage.removeItem('vaakku_dev_alias');
    }
  };

  return (
    <AnimatePresence>
      {isDeveloperModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5 select-none backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-[500px] bg-[#000000] border border-primary/50 rounded-[32px] p-8 flex flex-col gap-6 relative shadow-[0_0_50px_rgba(0,229,255,0.15)]">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-bold tracking-tight text-primary flex items-center gap-2">
                <IconShieldLock size={24} /> Developer Dashboard
              </span>
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-primary/50 transition-all active:scale-95"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Identity Override */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500">Identity Override</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[14px] text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter custom identity..."
                  />
                  <button
                    onClick={handleNameChange}
                    className="bg-primary text-black font-bold uppercase text-[11px] px-4 rounded-lg hover:bg-white transition-colors"
                  >
                    Set Name
                  </button>
                </div>
              </div>
              {/* Alternate Developer Alias */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500">Developer Alias (optional)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={devAlias}
                    onChange={(e) => setDevAlias(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[14px] text-white focus:border-primary outline-none transition-all"
                    placeholder="Enter dev alias..."
                  />
                  <button
                    onClick={handleAliasChange}
                    className="bg-primary text-black font-bold uppercase text-[11px] px-4 rounded-lg hover:bg-white transition-colors"
                  >
                    Set Alias
                  </button>
                </div>
              </div>

              {/* Active Users */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500 flex items-center gap-1">
                  <IconUsers size={12} /> Active Users ({activeUsers.length})
                </span>
                <div className="w-full bg-black/50 border border-white/10 rounded-xl p-3 max-h-[120px] overflow-y-auto flex flex-col gap-2">
                  {activeUsers.length === 0 ? (
                    <span className="text-[12px] text-neutral-500 italic">No other active users.</span>
                  ) : (
                    activeUsers.map(u => (
                      <div key={u.id} className="flex justify-between items-center text-[12px]">
                        <span className="text-white font-bold">{u.name}</span>
                        <span className="text-neutral-500 font-mono text-[9px]">{u.id}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Broadcast Input (Developer) */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500 flex items-center gap-1">
                  <IconBroadcast size={12} /> Broadcast Message
                </span>
                <textarea
                  rows={3}
                  placeholder="Type a message to broadcast..."
                  className="w-full bg-black/50 border border-primary/30 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition-all"
                  value={liveTyping?.text || ''}
                  onChange={(e) => {
                    const newMsg = {
                      author: devAlias.trim() || identity,
                      text: e.target.value,
                      ts: Date.now()
                    };
                    localStorage.setItem('vaakku_typing_event', JSON.stringify(newMsg));
                    setLiveTyping(newMsg);
                  }}
                />
              </div>

              {/* Watcher Terminal */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500 flex items-center gap-1">
                  <IconActivity size={12} /> Live Keystroke Intercept
                </span>
                <div className="w-full bg-black/50 border border-primary/30 rounded-xl p-3 font-mono text-[11px] h-[120px] overflow-y-auto">
                  <div className="text-primary/70 mb-2">{'>> AWAITING GLOBAL INPUT...'}</div>
                  {liveTyping ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold">[{new Date(liveTyping.ts).toLocaleTimeString()}] {liveTyping.author} says:</span>
                      <span className="text-primary/90 break-all">{liveTyping.text}</span>
                    </div>
                  ) : (
                    <div className="text-neutral-500 animate-pulse">listening...</div>
                  )}
                </div>
              </div>

              {/* Broadcast Stats */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500 flex items-center gap-1">
                  <IconBroadcast size={12} /> Broadcast Analytics
                </span>
                <div className="w-full bg-black/50 border border-white/10 rounded-xl p-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[24px] font-bold text-primary">{voicesToday}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Voices Today</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[24px] font-bold text-white">{posts.length}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Posts</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[24px] font-bold text-green-400">{activeUsers.length}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Live Users</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[24px] font-bold text-yellow-400">{posts.filter(p => p.isAnnouncement).length}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Announcements</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-neutral-500 flex items-center gap-1">
                  <IconChartBar size={12} /> Recent Broadcasts
                </span>
                <div className="w-full bg-black/50 border border-white/10 rounded-xl p-3 max-h-[200px] overflow-y-auto flex flex-col gap-2">
                  {posts.length === 0 ? (
                    <span className="text-[12px] text-neutral-500 italic">No broadcasts yet.</span>
                  ) : (
                    posts.slice(0, 10).map(p => (
                      <div key={p.id} className={`flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0 ${hiddenPosts.includes(p.id) ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-[11px]">{p.author}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500 text-[9px]">{new Date(p.ts).toLocaleTimeString()}</span>
                            <div className="flex items-center gap-1">
                              {hiddenPosts.includes(p.id) ? (
                                <button
                                  onClick={() => { playClickSound(); unhidePost(p.id); }}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Unhide post"
                                >
                                  <IconEyeOff size={12} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => { playClickSound(); hidePost(p.id); }}
                                  className="text-neutral-500 hover:text-primary transition-colors"
                                  title="Hide post"
                                >
                                  <IconEye size={12} />
                                </button>
                              )}
                              <button
                                onClick={() => { playClickSound(); deletePost(p.id); }}
                                className="text-red-500 hover:text-red-400 transition-colors"
                                title="Delete post"
                              >
                                <IconTrash size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <span className="text-neutral-400 text-[10px] truncate">{p.title}</span>
                        {p.isAnnouncement && (
                          <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">📢 Announcement</span>
                        )}
                        {hiddenPosts.includes(p.id) && (
                          <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">Hidden</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Hidden Posts Management */}
              {hiddenPosts.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[2px] font-bold text-red-500/80 flex items-center gap-1">
                    <IconEyeOff size={12} /> Hidden Posts ({hiddenPosts.length})
                  </span>
                  <button
                    onClick={() => { playClickSound(); hiddenPosts.forEach(id => unhidePost(id)); }}
                    className="w-full p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[11px] font-bold uppercase hover:bg-red-500/20 transition-colors"
                  >
                    Unhide All Posts
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
