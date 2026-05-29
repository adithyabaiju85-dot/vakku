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
  voicesToday: number;
  soundEnabled: boolean;
  isSettingsOpen: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setUserAvatar: (base64: string) => void;
  shuffleIdentity: () => void;
  addPost: (text: string, tag: Post["tag"], mood: Post["mood"]) => void;
  addComment: (postId: string, text: string) => void;
  toggleReaction: (postId: string, reactionType: "fire" | "heart" | "think") => void;
  clearData: () => void;
  isLoading: boolean;
  hasOnboarded: boolean;
  setOnboarded: (customName: string, customAvatar?: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [identity, setIdentity] = useState<string>("");
  const [userAvatar, setAvatar] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<UserReactions>({});
  const [voicesToday, setVoicesToday] = useState<number>(0);
  const [liveNow, setLiveNow] = useState<number>(148);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  // Initialize state from LocalStorage
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("vaakku_posts");
      const storedComments = localStorage.getItem("vaakku_comments");
      const storedIdentity = localStorage.getItem("vaakku_identity");
      const storedAvatar = localStorage.getItem("vaakku_avatar");
      const storedReactions = localStorage.getItem("vaakku_reactions");
      const storedVoicesCount = localStorage.getItem("vaakku_voices_today");
      const storedOnboarded = localStorage.getItem("vaakku_has_onboarded");
      const storedSound = localStorage.getItem("vaakku_sound_enabled");

      if (storedPosts) setPosts(JSON.parse(storedPosts));
      if (storedComments) setComments(JSON.parse(storedComments));
      if (storedIdentity) setIdentity(storedIdentity);
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedReactions) setUserReactions(JSON.parse(storedReactions));
      
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
    } catch (e) {
      console.error("Failed to load local storage state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync state to LocalStorage
  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem("vaakku_posts", JSON.stringify(newPosts));
  };

  const saveComments = (newComments: { [postId: string]: Comment[] }) => {
    setComments(newComments);
    localStorage.setItem("vaakku_comments", JSON.stringify(newComments));
  };

  const saveReactions = (newReactions: UserReactions) => {
    setUserReactions(newReactions);
    localStorage.setItem("vaakku_reactions", JSON.stringify(newReactions));
  };

  const saveVoicesToday = (count: number) => {
    setVoicesToday(count);
    localStorage.setItem("vaakku_voices_today", count.toString());
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("vaakku_sound_enabled", enabled.toString());
  };

  const setUserAvatar = (base64: string) => {
    setAvatar(base64);
    localStorage.setItem("vaakku_avatar", base64);
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
  };

  // Live counter fluctuation for premium feel
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const change = Math.floor(Math.random() * 3) * delta;
        const next = prev + change;
        return next > 165 ? 165 : next < 130 ? 130 : next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

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
    localStorage.setItem("vaakku_identity", trimmed);
    
    if (customAvatar) {
      setAvatar(customAvatar);
      localStorage.setItem("vaakku_avatar", customAvatar);
    }
    
    setHasOnboarded(true);
    localStorage.setItem("vaakku_has_onboarded", "true");
  };

  // Add a post
  const addPost = (text: string, tag: Post["tag"], mood: Post["mood"]) => {
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
      isNew: true
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    saveVoicesToday(voicesToday + 1);

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

  return (
    <StateContext.Provider
      value={{
        posts,
        comments,
        identity,
        userAvatar,
        userReactions,
        liveNow,
        voicesToday,
        soundEnabled,
        isSettingsOpen,
        setSoundEnabled,
        setIsSettingsOpen,
        setUserAvatar,
        shuffleIdentity,
        addPost,
        addComment,
        toggleReaction,
        clearData,
        isLoading,
        hasOnboarded,
        setOnboarded
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
