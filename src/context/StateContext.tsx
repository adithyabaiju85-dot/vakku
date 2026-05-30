"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getRandomIdentity, ANON_IDENTITY_POOL } from "@/utils/identity";

export interface Post {
  id: string;
  tag: "politics" | "education" | "jobs" | "society" | "culture" | "environment";
  title: string;
  body: string;
  fire: number;
  heart: number;
  think: number;
  comments: number;
  ts: number;
  author: string;
  av: number;
  mood: "frustrated" | "hopeful" | "confused" | "proud" | "serious";
  isNew?: boolean;
  isEdited?: boolean;
  isAnnouncement?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  av: number;
  body: string;
  ts: number;
}

interface UserReactions {
  [postId: string]: {
    fire: boolean;
    heart: boolean;
    think: boolean;
  };
}

interface StateContextType {
  posts: Post[];
  comments: { [postId: string]: Comment[] };
  identity: string;
  userAvatar: string | null;
  userReactions: UserReactions;
  liveNow: number;
  activeUsers: {id: string, name: string}[];
  voicesToday: number;
  soundEnabled: boolean;
  isSettingsOpen: boolean;
  isDeveloperModalOpen: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsDeveloperModalOpen: (isOpen: boolean) => void;
  setUserAvatar: (base64: string) => void;
  shuffleIdentity: () => void;
  addPost: (text: string, tag: Post["tag"], mood: Post["mood"], isAnnouncement?: boolean) => void;
  addComment: (postId: string, text: string) => void;
  toggleReaction: (postId: string, reactionType: "fire" | "heart" | "think") => void;
  clearData: () => void;
  isLoading: boolean;
  hasOnboarded: boolean;
  setOnboarded: (customName: string, customAvatar?: string) => void;
  isDeveloper: boolean;
  deletePost: (id: string) => void;
  editPost: (id: string, text: string) => void;
  logout: () => void;
  profiles: { [handle: string]: any };
  deleteComment: (postId: string, commentId: string) => void;
  hidePost: (id: string) => void;
  unhidePost: (id: string) => void;
  hiddenPosts: string[];
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [identity, setIdentity] = useState<string>("");
  const [userAvatar, setAvatar] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<UserReactions>({});
  const [voicesToday, setVoicesToday] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<{id: string, name: string}[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<{ [handle: string]: any }>({});
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  // Initialize state from LocalStorage
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("vaakku_posts_v3");
      const storedComments = localStorage.getItem("vaakku_comments_v3");
      const storedIdentity = localStorage.getItem("vaakku_identity_v3");
      const storedVoicesCount = localStorage.getItem("vaakku_voices_today_v3");
      const storedOnboarded = localStorage.getItem("vaakku_has_onboarded_v3");
      const storedSound = localStorage.getItem("vaakku_sound_enabled_v3");
      const storedProfiles = localStorage.getItem("vaakku_profiles_v3");
      const storedHiddenPosts = localStorage.getItem("vaakku_hidden_posts_v3");

      let currentProfiles: { [handle: string]: any } = {};
      if (storedProfiles) {
        currentProfiles = JSON.parse(storedProfiles);
        setProfiles(currentProfiles);
      }

      if (storedPosts) setPosts(JSON.parse(storedPosts));
      if (storedComments) setComments(JSON.parse(storedComments));
      
      if (storedIdentity) {
        setIdentity(storedIdentity);
        const profile = currentProfiles[storedIdentity];
        if (profile) {
          setAvatar(profile.avatar || null);
          setUserReactions(profile.reactions || {});
        }
      }
      
      if (storedVoicesCount) {
        setVoicesToday(parseInt(storedVoicesCount, 10));
      } else {
        setVoicesToday(0);
      }

      if (storedSound !== null) {
        setSoundEnabledState(storedSound === "true");
      }

      if (storedOnboarded === "true") {
        setHasOnboarded(true);
      }

      if (storedHiddenPosts) {
        setHiddenPosts(JSON.parse(storedHiddenPosts));
      }
    } catch (e) {
      console.error("Failed to load local storage state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for storage events for cross-tab syncing
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaakku_posts_v3" && e.newValue) {
        setPosts(JSON.parse(e.newValue));
      } else if (e.key === "vaakku_comments_v3" && e.newValue) {
        setComments(JSON.parse(e.newValue));
      } else if (e.key === "vaakku_reactions_v3" && e.newValue) {
        setUserReactions(JSON.parse(e.newValue));
      } else if (e.key === "vaakku_voices_today_v3" && e.newValue) {
        setVoicesToday(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync state to LocalStorage
  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem("vaakku_posts_v3", JSON.stringify(newPosts));
  };

  const saveComments = (newComments: { [postId: string]: Comment[] }) => {
    setComments(newComments);
    localStorage.setItem("vaakku_comments_v3", JSON.stringify(newComments));
  };

  const saveReactions = (newReactions: UserReactions) => {
    setUserReactions(newReactions);
    if (identity) {
      const newProfiles = {
        ...profiles,
        [identity]: { ...profiles[identity], reactions: newReactions }
      };
      setProfiles(newProfiles);
      localStorage.setItem("vaakku_profiles_v3", JSON.stringify(newProfiles));
    }
    localStorage.setItem("vaakku_reactions_v3", JSON.stringify(newReactions));
  };

  const saveVoicesToday = (count: number) => {
    setVoicesToday(count);
    localStorage.setItem("vaakku_voices_today_v3", count.toString());
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("vaakku_sound_enabled_v3", enabled.toString());
  };

  const setUserAvatar = (base64: string) => {
    setAvatar(base64);
    if (identity) {
      const newProfiles = {
        ...profiles,
        [identity]: { ...profiles[identity], avatar: base64 }
      };
      setProfiles(newProfiles);
      localStorage.setItem("vaakku_profiles_v3", JSON.stringify(newProfiles));
    }
  };

  const clearData = () => {
    localStorage.clear();
    setPosts([]);
    setComments({});
    setIdentity("");
    setAvatar(null);
    setUserReactions({});
    setVoicesToday(0);
    setHasOnboarded(false);
    setProfiles({});
  };

  const logout = () => {
    setIdentity("");
    setAvatar(null);
    setUserReactions({});
    setHasOnboarded(false);
    localStorage.removeItem("vaakku_identity_v3");
    localStorage.removeItem("vaakku_has_onboarded_v3");
  };

  // True Live Users - Heartbeat Mechanism
  useEffect(() => {
    const SESSION_ID = Math.random().toString(36).substring(2, 9);
    const PING_INTERVAL = 2000;
    const OFFLINE_TIMEOUT = 5000;

    const ping = () => {
      if (!hasOnboarded) return;
      try {
        const storedSessions = JSON.parse(localStorage.getItem("vaakku_active_sessions_v3") || "{}");
        const now = Date.now();
        
        const newSessions: any = {};
        for (const [id, data] of Object.entries(storedSessions)) {
          if (now - (data as any).time < OFFLINE_TIMEOUT) {
            newSessions[id] = data;
          }
        }
        
        newSessions[SESSION_ID] = { time: now, name: identity };
        
        localStorage.setItem("vaakku_active_sessions_v3", JSON.stringify(newSessions));
        
        const currentActive = Object.entries(newSessions).map(([id, data]: any) => ({id, name: data.name}));
        setActiveUsers(currentActive);
      } catch (e) {}
    };

    const interval = setInterval(ping, PING_INTERVAL);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaakku_active_sessions_v3" && e.newValue) {
         try {
           const sessions = JSON.parse(e.newValue);
           const now = Date.now();
           const currentActive: {id: string, name: string}[] = [];
           for (const [id, data] of Object.entries(sessions)) {
             if (now - (data as any).time < OFFLINE_TIMEOUT) {
                currentActive.push({id, name: (data as any).name});
             }
           }
           setActiveUsers(currentActive);
         } catch(e) {}
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      
      // Cleanup on unmount
      try {
        const stored = JSON.parse(localStorage.getItem("vaakku_active_sessions_v3") || "{}");
        delete stored[SESSION_ID];
        localStorage.setItem("vaakku_active_sessions_v3", JSON.stringify(stored));
      } catch(e) {}
    };
  }, [hasOnboarded, identity]);

  // Shuffle identity
  const shuffleIdentity = () => {
    let nextIdentity = getRandomIdentity();
    while (nextIdentity === identity && ANON_IDENTITY_POOL.length > 1) {
      nextIdentity = getRandomIdentity();
    }
    setIdentity(nextIdentity);
    localStorage.setItem("vaakku_identity", nextIdentity);
  };

  // Save onboarded state
  const setOnboarded = (customName: string, customAvatar?: string) => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    
    setIdentity(trimmed);
    localStorage.setItem("vaakku_identity_v3", trimmed);
    
    // Check if profile exists
    const existingProfile = profiles[trimmed];
    
    let avatarToUse = customAvatar || (existingProfile ? existingProfile.avatar : null);
    
    if (avatarToUse) {
      setAvatar(avatarToUse);
    } else {
      setAvatar(null);
    }

    const reactionsToUse = existingProfile ? existingProfile.reactions : {};
    setUserReactions(reactionsToUse);

    const newProfiles = {
      ...profiles,
      [trimmed]: {
        avatar: avatarToUse,
        reactions: reactionsToUse
      }
    };
    setProfiles(newProfiles);
    localStorage.setItem("vaakku_profiles_v3", JSON.stringify(newProfiles));
    
    setHasOnboarded(true);
    localStorage.setItem("vaakku_has_onboarded_v3", "true");
  };

  // Add a post
  const addPost = (text: string, tag: Post["tag"], mood: Post["mood"], isAnnouncement?: boolean) => {
    if (!text.trim()) return;

    const activeMood = mood || "serious";

    const textLines = text.split("\n");
    let titleText = textLines[0].trim();
    let bodyText = textLines.slice(1).join("\n").trim();

    if (titleText.length > 90) {
      const lastSpace = titleText.substring(0, 90).lastIndexOf(" ");
      const cut = lastSpace > 40 ? lastSpace : 90;
      bodyText = titleText.substring(cut).trim() + (bodyText ? "\n" + bodyText : "");
      titleText = titleText.substring(0, cut).trim();
    } else if (!bodyText && titleText.length > 60) {
      const half = titleText.substring(0, 60).lastIndexOf(" ");
      if (half > 20) {
        bodyText = titleText.substring(half).trim();
        titleText = titleText.substring(0, half).trim();
      }
    }

    if (!bodyText) {
      bodyText = "";
    }

    const authorName = identity || getRandomIdentity();
    const avIndex = ANON_IDENTITY_POOL.indexOf(authorName);

    const newPost: Post = {
      id: "post-" + Date.now(),
      tag,
      title: titleText,
      body: bodyText,
      fire: 1,
      heart: 0,
      think: 0,
      comments: 0,
      ts: Date.now(),
      author: authorName,
      av: avIndex === -1 ? 0 : avIndex % 6,
      mood: activeMood,
      isNew: true,
      isAnnouncement: isDeveloper ? isAnnouncement : false
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    saveVoicesToday(voicesToday + 1);

    // Trigger announcement notification for all users
    if (newPost.isAnnouncement) {
      localStorage.setItem("vaakku_announcement_trigger", JSON.stringify({
        id: newPost.id,
        ts: Date.now()
      }));
    }

    const newReactions = {
      ...userReactions,
      [newPost.id]: {
        fire: true,
        heart: false,
        think: false
      }
    };
    saveReactions(newReactions);
  };

  // Add a comment
  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const authorName = identity || getRandomIdentity();
    const avIndex = ANON_IDENTITY_POOL.indexOf(authorName);

    const newComment: Comment = {
      id: "comment-" + Date.now(),
      postId,
      author: authorName,
      av: avIndex === -1 ? 0 : avIndex % 6,
      body: text.trim(),
      ts: Date.now()
    };

    const updatedCommentsForPost = [...(comments[postId] || []), newComment];
    const newCommentsState = {
      ...comments,
      [postId]: updatedCommentsForPost
    };
    saveComments(newCommentsState);

    const newPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: updatedCommentsForPost.length };
      }
      return p;
    });
    savePosts(newPosts);
  };

  // Toggle reaction
  const toggleReaction = (postId: string, reactionType: "fire" | "heart" | "think") => {
    const postReactions = userReactions[postId] || { fire: false, heart: false, think: false };
    const currentlyActive = postReactions[reactionType];

    const updatedPostReactions = {
      ...postReactions,
      [reactionType]: !currentlyActive
    };

    const newReactions = {
      ...userReactions,
      [postId]: updatedPostReactions
    };
    saveReactions(newReactions);

    const modifier = currentlyActive ? -1 : 1;
    const newPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          [reactionType]: Math.max(0, p[reactionType] + modifier)
        };
      }
      return p;
    });
    savePosts(newPosts);
  };

  const isDeveloper = identity === "pragya@sappos";

  const deletePost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    // Developer can delete anything, author can delete their own
    if (!isDeveloper && post.author !== identity) return;
    
    const newPosts = posts.filter(p => p.id !== id);
    savePosts(newPosts);
    
    // Decrease voices today count when post is deleted
    saveVoicesToday(Math.max(0, voicesToday - 1));
  };

  const editPost = (id: string, text: string) => {
    const textLines = text.split("\n");
    let titleText = textLines[0].trim();
    let bodyText = textLines.slice(1).join("\n").trim();

    if (titleText.length > 90) {
      const lastSpace = titleText.substring(0, 90).lastIndexOf(" ");
      const cut = lastSpace > 40 ? lastSpace : 90;
      bodyText = titleText.substring(cut).trim() + (bodyText ? "\n" + bodyText : "");
      titleText = titleText.substring(0, cut).trim();
    } else if (!bodyText && titleText.length > 60) {
      const half = titleText.substring(0, 60).lastIndexOf(" ");
      if (half > 20) {
        bodyText = titleText.substring(half).trim();
        titleText = titleText.substring(0, half).trim();
      }
    }

    const newPosts = posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          title: titleText,
          body: bodyText,
          isEdited: true
        };
      }
      return p;
    });
    savePosts(newPosts);
  };

  const deleteComment = (postId: string, commentId: string) => {
    const postComments = comments[postId] || [];
    const updatedComments = postComments.filter(c => c.id !== commentId);
    
    const newCommentsState = {
      ...comments,
      [postId]: updatedComments
    };
    saveComments(newCommentsState);

    const newPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: updatedComments.length };
      }
      return p;
    });
    savePosts(newPosts);
  };

  const hidePost = (id: string) => {
    const newHiddenPosts = [...hiddenPosts, id];
    setHiddenPosts(newHiddenPosts);
    localStorage.setItem("vaakku_hidden_posts_v3", JSON.stringify(newHiddenPosts));
  };

  const unhidePost = (id: string) => {
    const newHiddenPosts = hiddenPosts.filter(postId => postId !== id);
    setHiddenPosts(newHiddenPosts);
    localStorage.setItem("vaakku_hidden_posts_v3", JSON.stringify(newHiddenPosts));
  };

  return (
    <StateContext.Provider
      value={{
        posts,
        comments,
        identity,
        userAvatar,
        userReactions,
        liveNow: activeUsers.length,
        activeUsers,
        voicesToday,
        soundEnabled,
        isSettingsOpen,
        isDeveloperModalOpen,
        setSoundEnabled,
        setIsSettingsOpen,
        setIsDeveloperModalOpen,
        setUserAvatar,
        shuffleIdentity,
        addPost,
        addComment,
        toggleReaction,
        clearData,
        isLoading,
        hasOnboarded,
        setOnboarded,
        isDeveloper,
        deletePost,
        editPost,
        logout,
        profiles,
        deleteComment,
        hidePost,
        unhidePost,
        hiddenPosts
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};
