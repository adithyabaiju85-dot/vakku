# Vaakku — Full Build Prompt
### "Voice of Kerala Youth" · Anonymous Opinion Platform

---

## 1. Project identity

**Name:** Vaakku (വാക്ക് — Malayalam for "word / voice")  
**Tagline:** your voice, no name attached.  
**Concept:** An anonymous opinion and expression platform for Kerala's youth (18–30). Think the emotional rawness of Reddit meets the aesthetic sensibility of a modern Gen Z app — but uniquely Kerala in its language, topics, and soul. Not a Reddit clone. Feels like it was built by and for Malayalam-speaking youth.

---

## 2. Brand & visual identity

### Colour palette
| Role | Hex | Usage |
|---|---|---|
| Primary accent | `#1D9E75` | Buttons, active states, links |
| Accent dark | `#0F6E56` | Hover states, headings on light |
| Accent light | `#E1F5EE` | Active backgrounds, tag pills |
| Accent border | `#9FE1CB` | Borders on accent surfaces |
| Fire reaction | `#F0997B` / bg `#FAECE7` | Fire/relatable reaction |
| Heart reaction | `#ED93B1` / bg `#FBEAF0` | Heart/emotional reaction |
| Think reaction | `#AFA9EC` / bg `#EEEDFE` | Brain/thoughtful reaction |
| Politics tag | bg `#FAECE7`, text `#993C1D` | |
| Education tag | bg `#EAF3DE`, text `#3B6D11` | |
| Jobs tag | bg `#FAEEDA`, text `#854F0B` | |
| Society tag | bg `#EEEDFE`, text `#534AB7` | |
| Culture tag | bg `#E6F1FB`, text `#185FA5` | |
| Environment tag | bg `#E1F5EE`, text `#0F6E56` | |
| New badge | bg `#FAEEDA`, text `#854F0B` | |

### Typography
- **Font:** Inter (primary UI), fallback system-ui
- **Wordmark:** `vaakku.` — 19px, weight 500, letter-spacing -0.5px, with the dot coloured `#1D9E75`
- **Body:** 14px, weight 400, line-height 1.6
- **Post titles:** 14px, weight 500, line-height 1.45
- **Meta / labels:** 12px, weight 400, colour `#888780`
- **Micro text:** 11px (timestamps, counts, badges)
- **Section labels (sidebar):** 10px, weight 500, uppercase, letter-spacing 0.5px, colour `#B4B2A9`
- **Never use weight 600 or 700** — max weight is 500

### Borders & surfaces
- All card borders: `0.5px solid rgba(0,0,0,0.1)` (light) / `0.5px solid rgba(255,255,255,0.08)` (dark)
- Card border-radius: `16px` throughout
- Inner element radius: `8px` for small pills, `20px` for round pills and buttons
- No drop shadows anywhere
- No gradients anywhere
- Background: `#F7F7F5` (light mode page bg), cards are `#FFFFFF`

---

## 3. Layout structure

### Top navigation bar (52px tall)
```
[ vaakku. ]   [ feed | trending | pulse | my space ]   [ identity-pill ][ search-icon ]
```
- Left: wordmark `vaakku.`
- Centre: 4 nav chips — feed, trending, pulse, my space — as pill buttons. Active state: `background #E1F5EE`, text `#0F6E56`
- Right: identity pill (shows anonymous name + green dot + shuffle icon) + circular search button
- Border-bottom: 0.5px

### Mood filter strip (below nav)
```
what's the vibe:  [ all ] [ frustrated ] [ hopeful ] [ confused ] [ proud ] [ serious ]
```
- Horizontally scrollable row of mood pills with Tabler outline icons
- Active pill: `border-color #1D9E75`, `background #E1F5EE`, text `#0F6E56`
- Filters the entire feed by emotional mood tag on each post

### Main content area (two-column grid)
- Left column: `1fr` (feed)
- Right column: `200px` (sidebar)
- Gap: `14px`
- Page padding: `14px 20px`
- Max-width: `960px`, centred

---

## 4. Feed column (left)

### Compose card
- White card, 16px radius, 16px padding
- Top row: mask icon avatar (green tinted circle) + textarea
- Textarea: no border, no background, placeholder text: `"your voice, no name attached. speak."`
- Divider line separates textarea from footer
- Footer row: topic tag selector (left) + "speak" button (right)
- Topic tags: `politics`, `education`, `jobs`, `society`, `culture`, `environment` — as small pill buttons. Selected state: green accent
- Speak button: `background #1D9E75`, white text, `border-radius 20px`, disabled (greyed) until text is typed, enabled on any input

### Sort row (below compose)
- Three buttons: `hot`, `fresh`, `most voices`
- Active: `background: black`, `color: white`, `border-radius 20px`

### Voice cards (post cards)
Each card has:

**Header row:**
- Left: 2-letter avatar circle (initials from first two words of anon name) with unique pastel bg/text colour per user, beside anon username (12px) and timestamp (11px)
- Right: optional "new" badge (amber) + topic tag pill (coloured per topic)

**Body:**
- Title: 14px, weight 500
- Body text: 13px, colour secondary, line-height 1.6
- Max ~3 lines of body before "read more" truncation

**Footer row (reactions):**
- `[flame icon] 89` — Fire reaction button. Active state: bg `#FAECE7`, border `#F0997B`, text `#993C1D`
- `[heart icon] 34` — Heart reaction button. Active state: bg `#FBEAF0`, border `#ED93B1`, text `#993556`
- `[brain icon] 21` — Think reaction button. Active state: bg `#EEEDFE`, border `#AFA9EC`, text `#3C3489`
- Spacer (flex-grow)
- `[message-2 icon] 48` — comment count, greyed ghost button
- `[share-2 icon]` — share ghost button
- All reaction buttons toggle on click, updating count +1 / -1

**Hover state:** card border darkens slightly (`rgba(0,0,0,0.2)`)

### Anonymous avatar colour mapping
Cycle through 6 pastel bg/text pairs per user (based on their index or hash):
1. bg `#EEEDFE`, text `#534AB7` (purple)
2. bg `#E1F5EE`, text `#0F6E56` (teal)
3. bg `#FAECE7`, text `#993C1D` (coral)
4. bg `#FBEAF0`, text `#993556` (pink)
5. bg `#FAEEDA`, text `#854F0B` (amber)
6. bg `#EAF3DE`, text `#3B6D11` (green)

---

## 5. Sidebar (right, 200px)

### You are masked card
- Background `#E1F5EE`, border `#9FE1CB`, radius 16px
- Mask icon + title "you are masked" in `#0F6E56`
- Body: "No name. No face. Your identity shuffles every visit. Just your words." — 12px, `#0F6E56`

### Today's pulse card
- Section label: "TODAY'S PULSE"
- 4 horizontal bar rows: frustrated, hopeful, confused, proud
- Each row: label (min-width 90px) + thin bar (5px height, rounded) + percentage number
- Bar colours: frustrated `#F0997B`, hopeful `#5DCAA5`, confused `#AFA9EC`, proud `#ED93B1`
- Bar track: light grey bg

### Being talked about (trending) card
- Section label: "BEING TALKED ABOUT"
- 5 trend items, each: large muted rank number (18px, grey) + topic text (13px) + voice count (11px, grey)
- Hover: topic text turns `#1D9E75`

### Live stats bar
- Rounded card at bottom of sidebar
- Two stats side by side with a divider: `live now` (with red live dot) + `voices today`
- Numbers: 15px weight 500

---

## 6. Anonymous identity system

### Identity pill (top right)
- Shows: green dot + current anon name + refresh/shuffle icon
- On click: randomly picks a new name from a pool of 12 names
- Format: `[adjective]_[noun]_[4-digit number]`
- Example pool: `silent_weaver_7731`, `monsoon_poet_2209`, `coconut_sage_8847`, `backwater_echo_3312`, `river_dreamer_5561`, `quiet_hill_9923`, `bronze_sparrow_1144`, `old_banyan_6678`, `night_reader_4490`, `forgotten_star_8823`, `hollow_reed_5502`, `wandering_kite_3377`

### Post authorship
- When posting, randomly assign one of the 12 names (not necessarily the user's current identity — adds ambiguity)
- Avatar initials = first letter of word 1 + first letter of word 2 from the name (e.g. `silent_weaver` → `SW`)
- Avatar colour = deterministic from the name index in the pool

---

## 7. Mood system

Each post has a `mood` field from: `frustrated`, `hopeful`, `confused`, `proud`, `serious`

The mood filter strip filters the feed. Mood is selected during compose (can be optional — defaults to `serious` if not set).

Mood icons (Tabler outline):
- frustrated → `ti-flame`
- hopeful → `ti-sun`
- confused → `ti-mood-confused`
- proud → `ti-heart`
- serious → `ti-urgent`

---

## 8. Feed logic

### Sort modes
- **hot:** weighted score = `(fire × 1.5) + heart + think + (comments × 2)`, descending
- **fresh:** sort by `timestamp` descending
- **most voices:** sort by `(fire + heart + think)` descending

### Mood filter
- When a mood is active, only show posts where `post.mood === selectedMood`
- "all" shows everything

### On compose submit
- Validate: text must not be empty
- Create post object: `{ id, tag, title (first line, max 90 chars), body (rest of text), fire: 1, heart: 0, think: 0, comments: 0, ts: Date.now(), author: randomName(), av: randomIndex(), mood: selectedMood || 'serious', uFire: true, uHeart: false, uThink: false, isNew: true }`
- Prepend to posts array
- Clear textarea, disable speak button, deselect tags
- Increment "voices today" counter

---

## 9. Seed data (6 starter posts)

```json
[
  {
    "tag": "jobs",
    "title": "Why do Kerala engineers keep leaving for Bangalore?",
    "body": "Every year thousands of us graduate and immediately plan to leave. The state has talent but nothing to hold it. When will real companies set up here?",
    "fire": 89, "heart": 34, "think": 21, "comments": 48,
    "mood": "frustrated", "author": "silent_weaver_7731", "av": 0
  },
  {
    "tag": "education",
    "title": "PSC coaching is just warehousing our youth",
    "body": "We spend 3–5 years after graduation in coaching centers. This is not education, it's parking us until something opens. We deserve better paths forward.",
    "fire": 72, "heart": 41, "think": 55, "comments": 71,
    "mood": "serious", "author": "monsoon_poet_2209", "av": 1
  },
  {
    "tag": "society",
    "title": "I tried talking to my parents about anxiety. First response: what will people think.",
    "body": "Kerala has the highest literacy in India. But we still can't say the words 'I need help' without it becoming a family crisis. Something is broken.",
    "fire": 114, "heart": 97, "think": 38, "comments": 92,
    "mood": "frustrated", "author": "river_dreamer_5561", "av": 4, "isNew": true
  },
  {
    "tag": "politics",
    "title": "Youth wings exist but real power never trickles down",
    "body": "We campaign, we vote, we lose. Every gram panchayat runs on the same families. The promised inclusion is just optics.",
    "fire": 63, "heart": 18, "think": 44, "comments": 36,
    "mood": "frustrated", "author": "bronze_sparrow_1144", "av": 2
  },
  {
    "tag": "environment",
    "title": "The river near my town is unrecognisably dirty now",
    "body": "I grew up swimming in it. Now there's discolouration and foam. Reports get filed, nothing happens. Does this sound familiar to anyone else?",
    "fire": 51, "heart": 44, "think": 29, "comments": 28,
    "mood": "serious", "author": "quiet_hill_9923", "av": 3
  },
  {
    "tag": "culture",
    "title": "We celebrate Kerala arts but not the artists living in poverty",
    "body": "Kathakali performers earn below minimum wage. Classical musicians survive on tuition. We love the culture, just not the people keeping it alive.",
    "fire": 67, "heart": 88, "think": 31, "comments": 41,
    "mood": "proud", "author": "coconut_sage_8847", "av": 5
  }
]
```

---

## 10. Tech stack recommendation

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Fast, SEO-friendly, easy deployment |
| Styling | Tailwind CSS | Matches the utility-first approach of the prototype |
| Icons | Tabler Icons React | Exact icon set used in prototype |
| Font | Inter via Google Fonts | Clean, modern, matches design |
| Backend | Supabase (Postgres + Auth) | Anonymous auth built-in, real-time subscriptions for live counts |
| Anonymous auth | Supabase anonymous sign-in | Generates a random user ID per session, no email required |
| Deployment | Vercel | Zero-config Next.js deployment |
| Image CDN | Cloudinary (optional) | Only if image posts are added later |

---

## 11. Database schema (Supabase)

```sql
-- posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  author_name text not null,         -- anon display name
  author_av int default 0,           -- avatar colour index 0–5
  tag text not null,                 -- politics | education | jobs | society | culture | environment
  mood text not null,                -- frustrated | hopeful | confused | proud | serious
  title text not null,
  body text not null,
  fire_count int default 0,
  heart_count int default 0,
  think_count int default 0,
  comment_count int default 0,
  session_id uuid                    -- Supabase anonymous user id
);

-- reactions
create table reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  session_id uuid not null,
  reaction_type text not null,       -- fire | heart | think
  unique(post_id, session_id, reaction_type)
);

-- comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  post_id uuid references posts(id) on delete cascade,
  author_name text not null,
  author_av int default 0,
  body text not null,
  session_id uuid
);
```

---

## 12. Page routes

| Route | Description |
|---|---|
| `/` | Main feed (default: hot sort, all moods) |
| `/post/[id]` | Single post with comment thread |
| `/trending` | Trending topics page |
| `/pulse` | Mood analytics page — charts of daily/weekly mood data |
| `/my-space` | This session's posts and reactions (no login, just session-based) |

---

## 13. Key UX rules (do not break these)

1. **No real names anywhere.** The word "username" never appears. Always "identity" or "your mask".
2. **The speak button is always disabled until the user types something.** No empty posts.
3. **Reactions toggle.** Clicking a second time removes the reaction and decrements the count.
4. **Identity shuffle** — clicking the identity pill immediately picks a new name from the pool. It does NOT require a page reload.
5. **Mood filter persists** while navigating the sort (hot/fresh/most voices) — they are independent filters.
6. **"isNew" badge** appears for posts under 2 hours old automatically.
7. **No upvote/downvote.** Only the three reactions (fire, heart, think). No negative feedback mechanism.
8. **No follower counts, no profile pages, no DMs.** This is a broadcast-only platform.
9. **The compose box placeholder text:** `"your voice, no name attached. speak."` — do not change this.
10. **All counts display as formatted numbers:** under 1000 show as integer, 1000+ show as `1.2k` etc.

---

## 14. Microcopy reference

| Element | Copy |
|---|---|
| Page title | `vaakku. — voice of kerala youth` |
| Compose placeholder | `your voice, no name attached. speak.` |
| Submit button | `speak` |
| Identity pill label | `(anon-name)` |
| Shuffle tooltip | `shuffle identity` |
| Masked card title | `you are masked` |
| Masked card body | `No name. No face. Your identity shuffles every visit. Just your words.` |
| Mood strip label | `what's the vibe:` |
| Trending section label | `being talked about` |
| Pulse section label | `today's pulse` |
| Empty feed | `no voices here yet — be the first.` |
| Nav items | `feed`, `trending`, `pulse`, `my space` |
| Sort buttons | `hot`, `fresh`, `most voices` |

---

## 15. What this is NOT

- Not Reddit — no subreddits, no karma, no upvote arrows
- Not Twitter/X — no following, no timeline, no verification
- Not Instagram — no images as primary content, no explore grid
- Not a news site — no articles, no editors
- Not a chat app — no DMs, no real-time chat threads

It is a **public anonymous bulletin board** with emotional intelligence built in.

