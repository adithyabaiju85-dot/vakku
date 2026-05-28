"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getRandomIdentity, getColorPairForName, ANON_IDENTITY_POOL } from "@/utils/identity";

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
  userReactions: UserReactions;
  liveNow: number;
  voicesToday: number;
  shuffleIdentity: () => void;
  addPost: (text: string, tag: Post["tag"], mood: Post["mood"]) => void;
  addComment: (postId: string, text: string) => void;
  toggleReaction: (postId: string, reactionType: "fire" | "heart" | "think") => void;
  isLoading: boolean;
  hasOnboarded: boolean;
  setOnboarded: (customName: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    tag: "jobs",
    title: "Why do Kerala engineers keep leaving for Bangalore?",
    body: "Every year thousands of us graduate and immediately plan to leave. The state has talent but nothing to hold it. When will real companies set up here? Kakkanad Infopark is just service-based sweatshops.",
    fire: 89,
    heart: 34,
    think: 21,
    comments: 3,
    ts: Date.now() - 3600000 * 5, // 5 hours ago
    author: "silent_weaver_7731",
    av: 0,
    mood: "frustrated"
  },
  {
    id: "seed-2",
    tag: "education",
    title: "PSC coaching is just warehousing our youth",
    body: "We spend 3–5 years after graduation in coaching centers. This is not education, it's parking us until something opens. We deserve better paths forward than mugging up dates of battles.",
    fire: 72,
    heart: 41,
    think: 55,
    comments: 2,
    ts: Date.now() - 3600000 * 12, // 12 hours ago
    author: "monsoon_poet_2209",
    av: 1,
    mood: "serious"
  },
  {
    id: "seed-3",
    tag: "society",
    title: "I tried talking to my parents about anxiety. First response: what will people think.",
    body: "Kerala has the highest literacy in India. But we still can't say the words 'I need help' without it becoming a family crisis. Something is broken in our moral policing culture.",
    fire: 114,
    heart: 97,
    think: 38,
    comments: 4,
    ts: Date.now() - 600000, // 10 mins ago (new)
    author: "river_dreamer_5561",
    av: 4,
    mood: "frustrated",
    isNew: true
  },
  {
    id: "seed-4",
    tag: "politics",
    title: "Youth wings exist but real power never trickles down",
    body: "We campaign, we vote, we lose. Every gram panchayat runs on the same families. The promised inclusion is just optics to paste posters.",
    fire: 63,
    heart: 18,
    think: 44,
    comments: 2,
    ts: Date.now() - 3600000 * 24, // 1 day ago
    author: "bronze_sparrow_1144",
    av: 2,
    mood: "frustrated"
  },
  {
    id: "seed-5",
    tag: "environment",
    title: "The river near my town is unrecognisably dirty now",
    body: "I grew up swimming in it. Now there's discolouration and foam. Reports get filed, nothing happens. Does this sound familiar to anyone else? We talk about nature tourism but ignore our backyard.",
    fire: 51,
    heart: 44,
    think: 29,
    comments: 2,
    ts: Date.now() - 3600000 * 3, // 3 hours ago
    author: "quiet_hill_9923",
    av: 3,
    mood: "serious"
  },
  {
    id: "seed-6",
    tag: "culture",
    title: "We celebrate Kerala arts but not the artists living in poverty",
    body: "Kathakali performers earn below minimum wage. Classical musicians survive on tuition. We love the culture, just not the people keeping it alive. They deserve stable pensions.",
    fire: 67,
    heart: 88,
    think: 31,
    comments: 3,
    ts: Date.now() - 3600000 * 48, // 2 days ago
    author: "coconut_sage_8847",
    av: 5,
    mood: "proud"
  }
];

const SEED_COMMENTS: { [postId: string]: Comment[] } = {
  "seed-1": [
    {
      id: "c-1",
      postId: "seed-1",
      author: "monsoon_poet_2209",
      av: 1,
      body: "Exactly! Product companies simply don't recruit here. Even standard dev jobs are paid 15k a month in Infopark. It's embarrassing.",
      ts: Date.now() - 3600000 * 4
    },
    {
      id: "c-2",
      postId: "seed-1",
      author: "coconut_sage_8847",
      av: 5,
      body: "The living cost in Kochi is rising rapidly too. You can't survive on those entry level packages anymore. Migration is a necessity, not a choice.",
      ts: Date.now() - 3600000 * 3.5
    },
    {
      id: "c-3",
      postId: "seed-1",
      author: "quiet_hill_9923",
      av: 3,
      body: "But Bangalore has horrible traffic and rent is insane. If Kochi gets proper startups, I'd move back in a heartbeat.",
      ts: Date.now() - 3600000 * 2
    }
  ],
  "seed-2": [
    {
      id: "c-4",
      postId: "seed-2",
      author: "river_dreamer_5561",
      av: 4,
      body: "True. It sucks the most productive years out of Kerala's youth. People waste their twenties waiting to write exams.",
      ts: Date.now() - 3600000 * 11
    },
    {
      id: "c-5",
      postId: "seed-2",
      author: "bronze_sparrow_1144",
      av: 2,
      body: "It's because of the societal prestige associated with a government job. Our parents just want the pension and label. We need vocational skills instead.",
      ts: Date.now() - 3600000 * 8
    }
  ],
  "seed-3": [
    {
      id: "c-6",
      postId: "seed-3",
      author: "forgotten_star_8823",
      av: 9,
      body: "My parents told me to wake up early and go for a walk when I mentioned I couldn't focus. Absolute disconnect.",
      ts: Date.now() - 400000
    },
    {
      id: "c-7",
      postId: "seed-3",
      author: "hollow_reed_5502",
      av: 10,
      body: "Mental health literacy is close to 0 here. 'Sadness' is treated as laziness or lack of gratitude.",
      ts: Date.now() - 300000
    },
    {
      id: "c-8",
      postId: "seed-3",
      author: "wandering_kite_3377",
      av: 11,
      body: "Stay strong, comrade. The younger generation gets it. Seek professional help online if your local area has gossip mongers.",
      ts: Date.now() - 200000
    },
    {
      id: "c-9",
      postId: "seed-3",
      author: "silent_weaver_7731",
      av: 0,
      body: "This is the most relatable thing I've read today. High literacy != emotional maturity.",
      ts: Date.now() - 50000
    }
  ],
  "seed-4": [
    {
      id: "c-10",
      postId: "seed-4",
      author: "old_banyan_6678",
      av: 7,
      body: "Youth wings are literally just muscle for strikes. They don't want us debating policy, they want us waving flags.",
      ts: Date.now() - 3600000 * 20
    },
    {
      id: "c-11",
      postId: "seed-4",
      author: "night_reader_4490",
      av: 8,
      body: "Exactly. The senior leadership has been there for 30 years and won't step down.",
      ts: Date.now() - 3600000 * 16
    }
  ],
  "seed-5": [
    {
      id: "c-12",
      postId: "seed-5",
      author: "silent_weaver_7731",
      av: 0,
      body: "It's because tourists only see the clean, prepped houseboats. The actual canals and riverbanks are covered in plastic.",
      ts: Date.now() - 3600000 * 2.5
    },
    {
      id: "c-13",
      postId: "seed-5",
      author: "monsoon_poet_2209",
      av: 1,
      body: "We need severe penalties for industrial waste. No tourism is worth losing our clean drinking water.",
      ts: Date.now() - 3600000 * 1
    }
  ],
  "seed-6": [
    {
      id: "c-14",
      postId: "seed-6",
      author: "quiet_hill_9923",
      av: 3,
      body: "This is heartbreaking. We are so proud of our heritage, but the actual humans maintaining it are starved.",
      ts: Date.now() - 3600000 * 40
    },
    {
      id: "c-15",
      postId: "seed-6",
      author: "river_dreamer_5561",
      av: 4,
      body: "It's pure commodification. Government pays token amounts, and temple committees spend lakhs on fireworks but peanuts on artists.",
      ts: Date.now() - 3600000 * 36
    },
    {
      id: "c-16",
      postId: "seed-6",
      author: "bronze_sparrow_1144",
      av: 2,
      body: "Well said. A culture is only alive if its artists can feed their kids.",
      ts: Date.now() - 3600000 * 30
    }
  ]
};

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [identity, setIdentity] = useState<string>("");
  const [userReactions, setUserReactions] = useState<UserReactions>({});
  const [voicesToday, setVoicesToday] = useState<number>(0);
  const [liveNow, setLiveNow] = useState<number>(148);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  // Initialize state from LocalStorage or seed data
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("vaakku_posts");
      const storedComments = localStorage.getItem("vaakku_comments");
      const storedIdentity = localStorage.getItem("vaakku_identity");
      const storedReactions = localStorage.getItem("vaakku_reactions");
      const storedVoicesCount = localStorage.getItem("vaakku_voices_today");
      const storedOnboarded = localStorage.getItem("vaakku_has_onboarded");

      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(SEED_POSTS);
        localStorage.setItem("vaakku_posts", JSON.stringify(SEED_POSTS));
      }

      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments(SEED_COMMENTS);
        localStorage.setItem("vaakku_comments", JSON.stringify(SEED_COMMENTS));
      }

      if (storedIdentity) {
        setIdentity(storedIdentity);
      } else {
        const initialIdentity = getRandomIdentity();
        setIdentity(initialIdentity);
        localStorage.setItem("vaakku_identity", initialIdentity);
      }

      if (storedReactions) {
        setUserReactions(JSON.parse(storedReactions));
      } else {
        setUserReactions({});
      }

      if (storedVoicesCount) {
        setVoicesToday(parseInt(storedVoicesCount, 10));
      } else {
        setVoicesToday(158);
        localStorage.setItem("vaakku_voices_today", "158");
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
  const setOnboarded = (customName: string) => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    setIdentity(trimmed);
    localStorage.setItem("vaakku_identity", trimmed);
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

    const authorName = getRandomIdentity();
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
        userReactions,
        liveNow,
        voicesToday,
        shuffleIdentity,
        addPost,
        addComment,
        toggleReaction,
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
