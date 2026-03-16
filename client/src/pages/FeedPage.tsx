import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Post {
  id: number;
  author: string;
  initials: string;
  denomination: string;
  location: string;
  country: string;
  timeAgo: string;
  category: string;
  title: string;
  body: string;
  prayerCount: number;
  commentCount: number;
  shareCount: number;
  prayed: boolean;
}

interface Comment {
  id: number;
  author: string;
  initials: string;
  timeAgo: string;
  text: string;
}

// ── Sample Data ───────────────────────────────────────────────────────────────
const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    author: "Margaret Thornton",
    initials: "MT",
    denomination: "Baptist",
    location: "Nashville, TN",
    country: "🇺🇸",
    timeAgo: "2 hours ago",
    category: "Healing",
    title: "Three years of prayer — answered in one night",
    body: "My husband was diagnosed with stage 3 lymphoma in 2021. Our church prayed without ceasing. Last Tuesday, after his final scan, the oncologist walked in visibly shaken. There was no trace of the cancer anywhere in his body. The medical team called it unexplainable. I call it exactly what it is — a miracle. I felt called to share this here so that others holding onto hope know: keep praying. God hears every word.",
    prayerCount: 847,
    commentCount: 134,
    shareCount: 89,
    prayed: false,
  },
  {
    id: 2,
    author: "David Okonkwo",
    initials: "DO",
    denomination: "Pentecostal",
    location: "Lagos",
    country: "🇳🇬",
    timeAgo: "5 hours ago",
    category: "Provision",
    title: "The envelope with no return address",
    body: "We were down to our last few naira with four children and rent due the next morning. My wife and I prayed together that night and surrendered the situation completely to God. The next day an envelope arrived in the mail — no return address, no name inside. Exactly the amount we needed. I have never experienced anything like it before or since. To whoever was moved to send it: you will never know what you did for our family.",
    prayerCount: 612,
    commentCount: 98,
    shareCount: 54,
    prayed: true,
  },
  {
    id: 3,
    author: "Rosa Lima",
    initials: "RL",
    denomination: "Catholic",
    location: "São Paulo",
    country: "🇧🇷",
    timeAgo: "1 day ago",
    category: "Divine Guidance",
    title: "Something told me to turn around",
    body: "I was driving home on the same road I take every single day. Something — I cannot describe it as anything other than a voice — told me to turn back. I pulled over, confused. Ninety seconds later, a truck ran a red light at the intersection I would have been crossing. The dashcam footage later showed I would have been directly in its path. I sat in my car and wept for twenty minutes. I am here today because of that voice.",
    prayerCount: 1203,
    commentCount: 211,
    shareCount: 176,
    prayed: false,
  },
  {
    id: 4,
    author: "James Kimani",
    initials: "JK",
    denomination: "Anglican",
    location: "Nairobi",
    country: "🇰🇪",
    timeAgo: "2 days ago",
    category: "Protection",
    title: "The fire that stopped at our door",
    body: "A fire broke out in our apartment block at 2am. By morning, every unit on our floor was destroyed — except ours. The fire investigator said he had no explanation for why it stopped where it did. What he didn't know was that my daughter, aged nine, had prayed over our doorframe just that morning — something she said 'God asked her to do.' I am sharing this because I believe God uses the faith of children in ways we cannot comprehend.",
    prayerCount: 934,
    commentCount: 167,
    shareCount: 103,
    prayed: false,
  },
  {
    id: 5,
    author: "Patricia Hughes",
    initials: "PH",
    denomination: "Methodist",
    location: "Birmingham",
    country: "🇬🇧",
    timeAgo: "3 days ago",
    category: "Restoration",
    title: "My son called after eleven years",
    body: "My son and I had not spoken since a terrible falling out in 2013. I had prayed for reconciliation every single day, and on the tenth anniversary of our estrangement I told God I was releasing the outcome to Him — that I trusted His timing even if it meant never hearing from my son in this life. Three days later, my phone rang. It was him. He said he'd woken that morning with an overwhelming urge to call. We spoke for four hours. I cannot stop thanking God.",
    prayerCount: 2108,
    commentCount: 389,
    shareCount: 241,
    prayed: true,
  },
];

const SAMPLE_COMMENTS: Comment[] = [
  { id: 1, author: "Ana Vasquez", initials: "AV", timeAgo: "1 hour ago", text: "This brought tears to my eyes. I am praying for your continued blessing. God is so faithful." },
  { id: 2, author: "Samuel Park", initials: "SP", timeAgo: "3 hours ago", text: "Thank you for sharing this. My mother is going through something similar right now and this gave me renewed faith." },
  { id: 3, author: "Grace Adeyemi", initials: "GA", timeAgo: "5 hours ago", text: "Hallelujah! Stories like this are exactly why I joined this community. He is able!" },
];

const CATEGORIES = ["All", "Healing", "Answered Prayer", "Divine Guidance", "Protection", "Provision", "Restoration", "Spiritual Encounter"];

const DISPLAY = "'Cormorant Garamond', serif";
const BODY = "'Jost', sans-serif";

// ── Prayer Button ─────────────────────────────────────────────────────────────
function PrayerButton({ count, prayed, onPray }: { count: number; prayed: boolean; onPray: () => void }) {
  return (
    <button
      onClick={onPray}
      className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wide transition-all duration-300 border"
      style={{
        fontFamily: BODY,
        background: prayed ? "rgba(201,168,76,0.15)" : "transparent",
        borderColor: prayed ? "#C9A84C" : "#E5E1D8",
        color: prayed ? "#E8C97A" : "#6B7280",
      }}
    >
      <span style={{ fontSize: "1rem" }}>🙏</span>
      <span>{count.toLocaleString()} Praying</span>
    </button>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onPray }: { post: Post; onPray: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const shouldTruncate = post.body.length > 280;
  const displayBody = shouldTruncate && !expanded ? post.body.slice(0, 280) + "…" : post.body;

  const categoryColors: Record<string, string> = {
    Healing: "#7EC8A4",
    Provision: "#C9A84C",
    "Divine Guidance": "#A49BCC",
    Protection: "#6BAED6",
    Restoration: "#E8A87C",
    "Answered Prayer": "#E8C97A",
    "Spiritual Encounter": "#C97AB8",
  };
  const catColor = categoryColors[post.category] || "#C9A84C";

  return (
    <article
      className="rounded-sm border overflow-hidden"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(201,168,76,0.25)",
        fontFamily: BODY,
      }}
    >
      {/* Card top accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${catColor}55, transparent)` }} />

      <div className="p-6">
        {/* Author row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#E8C97A", fontFamily: DISPLAY }}
            >
              {post.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{post.author}</span>
                <span className="text-[0.65rem]" style={{ color: "#9CA3AF" }}>·</span>
                <span className="text-[0.7rem]" style={{ color: "#6B7280" }}>{post.denomination}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span style={{ fontSize: "0.75rem" }}>{post.country}</span>
                <span className="text-[0.7rem]" style={{ color: "#6B7280" }}>{post.location}</span>
                <span className="text-[0.65rem]" style={{ color: "#D1D5DB" }}>· {post.timeAgo}</span>
              </div>
            </div>
          </div>
          {/* Category badge */}
          <span
            className="text-[0.6rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm flex-shrink-0"
            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}
          >
            {post.category}
          </span>
        </div>

        {/* Post title */}
        <h2
          className="text-xl font-light mb-3 leading-snug"
          style={{ fontFamily: DISPLAY, color: "#111111" }}
        >
          {post.title}
        </h2>

        {/* Post body */}
        <p className="text-sm leading-relaxed mb-2" style={{ color: "#4B4B4B" }}>
          {displayBody}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#C9A84C] hover:text-[#E8C97A] transition-colors mb-4"
            style={{ fontFamily: BODY }}
          >
            {expanded ? "Show less" : "Read full testimony"}
          </button>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 mt-5 pt-4 flex-wrap"
          style={{ borderTop: "1px solid #F0EDE6" }}>
          <PrayerButton count={post.prayerCount} prayed={post.prayed} onPray={() => onPray(post.id)} />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wide border transition-all duration-200 hover:border-[#D1D5DB]"
            style={{ borderColor: "#E5E1D8", color: "#6B7280", fontFamily: BODY, background: "transparent" }}
          >
            <span>💬</span>
            <span>{post.commentCount} Comments</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wide border transition-all duration-200 hover:border-[#D1D5DB]"
            style={{ borderColor: "#E5E1D8", color: "#6B7280", fontFamily: BODY, background: "transparent" }}
          >
            <span>↗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-6 pb-6" style={{ borderTop: "1px solid #F0EDE6" }}>
          <div className="pt-4 space-y-4">
            {SAMPLE_COMMENTS.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C", fontFamily: DISPLAY }}
                >
                  {c.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium" style={{ color: "#1A1A1A" }}>{c.author}</span>
                    <span className="text-[0.65rem]" style={{ color: "#9CA3AF" }}>{c.timeAgo}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Share a word of encouragement…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-sm outline-none"
              style={{
                background: "#F5F3EF",
                border: "1px solid rgba(201,168,76,0.35)",
                color: "#1A1A1A",
                fontFamily: BODY,
              }}
            />
            <button
              className="px-4 py-2 text-xs rounded-sm transition-colors"
              style={{ background: "#C9A84C", color: "#0D0D12", fontFamily: BODY }}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Sidebar: Who to Follow ────────────────────────────────────────────────────
function SuggestedMembers() {
  const members = [
    { initials: "AV", name: "Ana Vasquez", location: "🇲🇽 Mexico City", denomination: "Catholic" },
    { initials: "SP", name: "Samuel Park", location: "🇰🇷 Seoul", denomination: "Presbyterian" },
    { initials: "GN", name: "Grace Nwosu", location: "🇳🇬 Abuja", denomination: "Pentecostal" },
    { initials: "TM", name: "Thomas Mueller", location: "🇩🇪 Munich", denomination: "Lutheran" },
  ];
  return (
    <div className="rounded-sm border p-5" style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.25)", fontFamily: BODY }}>
      <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-4">Believers to Follow</p>
      <div className="space-y-4">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#E8C97A", fontFamily: DISPLAY }}>
                {m.initials}
              </div>
              <div>
                <div className="text-xs" style={{ color: "#1A1A1A" }}>{m.name}</div>
                <div className="text-[0.65rem]" style={{ color: "#6B7280" }}>{m.location}</div>
              </div>
            </div>
            <button className="text-[0.65rem] tracking-wide px-3 py-1 rounded-sm border transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)]"
              style={{ borderColor: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar: Global Map Snapshot ──────────────────────────────────────────────
function GlobalSnapshot() {
  const regions = [
    { label: "North America", count: 1842, pct: 88 },
    { label: "Africa",        count: 1430, pct: 68 },
    { label: "Europe",        count: 987,  pct: 47 },
    { label: "South America", count: 764,  pct: 36 },
    { label: "Asia",          count: 521,  pct: 25 },
    { label: "Oceania",       count: 198,  pct: 9 },
  ];
  return (
    <div className="rounded-sm border p-5" style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.25)", fontFamily: BODY }}>
      <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Stories Worldwide</p>
      <p className="text-[0.7rem] mb-4" style={{ color: "#9CA3AF" }}>6,742 testimonies from 94 countries</p>
      <div className="space-y-3">
        {regions.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[0.7rem]" style={{ color: "#4B5563" }}>{r.label}</span>
              <span className="text-[0.7rem]" style={{ color: "#9CA3AF" }}>{r.count.toLocaleString()}</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: "#F0EDE6" }}>
              <div className="h-1 rounded-full transition-all duration-700"
                style={{ width: `${r.pct}%`, background: "linear-gradient(to right, #C9A84C, #E8C97A)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compose Box ───────────────────────────────────────────────────────────────
function ComposeBox() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Healing");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-sm border p-5" style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.35)", fontFamily: BODY }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left px-4 py-3 rounded-sm text-sm transition-all duration-200"
          style={{ background: "#F5F3EF", color: "#9CA3AF", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          Share a miracle or testimony…
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C]">Share Your Story</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-sm outline-none"
            style={{ background: "#F5F3EF", border: "1px solid rgba(201,168,76,0.35)", color: "#1A1A1A", fontFamily: BODY }}
          >
            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="text"
            placeholder="Give your testimony a title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-sm outline-none"
            style={{ background: "#F5F3EF", border: "1px solid rgba(201,168,76,0.35)", color: "#1A1A1A", fontFamily: BODY }}
          />
          <textarea
            placeholder="Tell your story. What happened? What did God do?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 text-sm rounded-sm outline-none resize-none"
            style={{ background: "#F5F3EF", border: "1px solid rgba(201,168,76,0.35)", color: "#1A1A1A", fontFamily: BODY }}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOpen(false)}
              className="px-4 py-2 text-xs rounded-sm border transition-colors"
              style={{ borderColor: "#E5E1D8", color: "#6B7280" }}>
              Cancel
            </button>
            <button
              className="px-5 py-2 text-xs rounded-sm font-medium tracking-wide"
              style={{ background: "#C9A84C", color: "#0D0D12" }}>
              Post Testimony
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Feed Page ────────────────────────────────────────────────────────────
export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const handlePray = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, prayed: !p.prayed, prayerCount: p.prayed ? p.prayerCount - 1 : p.prayerCount + 1 }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1A1A1A]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .feed-scroll::-webkit-scrollbar { width: 4px; }
        .feed-scroll::-webkit-scrollbar-track { background: transparent; }
        .feed-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.4); border-radius: 2px; }
        input:focus, textarea:focus, select:focus { border-color: rgba(201,168,76,0.5) !important; }
      `}</style>

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3"
        style={{ background: "rgba(255,255,255,0.97)", borderBottom: "1px solid rgba(201,168,76,0.25)", backdropFilter: "blur(8px)" }}>
        <a href="/" className="text-lg tracking-widest text-[#E8C97A] no-underline" style={{ fontFamily: DISPLAY }}>
          Proof of a Miracle
        </a>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm flex-1 max-w-xs mx-8"
          style={{ background: "#FFFFFF", border: "1px solid rgba(201,168,76,0.3)" }}>
          <span className="text-sm" style={{ color: "#9CA3AF" }}>🔍</span>
          <input type="text" placeholder="Search testimonies…" className="bg-transparent text-xs outline-none w-full"
            style={{ fontFamily: BODY, color: "#1A1A1A" }} />
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 text-xs tracking-wide px-4 py-2 rounded-sm"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#E8C97A" }}>
            <span>＋</span> Share Story
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C97A", fontFamily: DISPLAY }}>
            Y
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex max-w-6xl mx-auto pt-16">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] py-6 px-4 overflow-y-auto feed-scroll"
          style={{ borderRight: "1px solid rgba(201,168,76,0.07)" }}>
          <nav className="space-y-1">
            {[
              { icon: "🏠", label: "My Feed" },
              { icon: "✨", label: "Discover" },
              { icon: "🌍", label: "Global Map" },
              { icon: "👥", label: "Groups" },
              { icon: "🔔", label: "Notifications" },
              { icon: "👤", label: "My Profile" },
              { icon: "🔖", label: "Saved" },
            ].map(({ icon, label }) => (
              <button key={label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-left transition-all duration-200 hover:bg-[rgba(201,168,76,0.07)] hover:text-[#E8C97A]"
                style={{ color: label === "My Feed" ? "#E8C97A" : "#4B5563", background: label === "My Feed" ? "rgba(201,168,76,0.08)" : "transparent", fontFamily: BODY }}>
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
            <p className="text-[0.6rem] tracking-[0.18em] uppercase mb-3 px-3" style={{ color: "#D1D5DB" }}>Categories</p>
            <div className="space-y-1">
              {CATEGORIES.map((c) => (
                <button key={c}
                  onClick={() => setActiveCategory(c)}
                  className="w-full text-left px-3 py-2 rounded-sm text-xs transition-all duration-200"
                  style={{
                    color: activeCategory === c ? "#E8C97A" : "#6B7280",
                    background: activeCategory === c ? "rgba(201,168,76,0.1)" : "transparent",
                    fontFamily: BODY,
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── FEED ── */}
        <main className="flex-1 min-w-0 py-6 px-4 md:px-6">
          {/* Category pills (mobile/tablet) */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-2 lg:hidden" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((c) => (
              <button key={c}
                onClick={() => setActiveCategory(c)}
                className="flex-shrink-0 text-[0.7rem] tracking-wide px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background: activeCategory === c ? "rgba(201,168,76,0.15)" : "transparent",
                  borderColor: activeCategory === c ? "#C9A84C" : "#E5E1D8",
                  color: activeCategory === c ? "#E8C97A" : "#6B7280",
                  fontFamily: BODY,
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* Compose box */}
          <div className="mb-5">
            <ComposeBox />
          </div>

          {/* Feed header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-light" style={{ fontFamily: DISPLAY, color: "#111111" }}>
                {activeCategory === "All" ? "Community Feed" : activeCategory}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                {filteredPosts.length} testimonies · Updated just now
              </p>
            </div>
            <select className="text-xs px-3 py-1.5 rounded-sm outline-none"
              style={{ background: "#FFFFFF", border: "1px solid rgba(201,168,76,0.3)", color: "#4B5563", fontFamily: BODY }}>
              <option>Most Recent</option>
              <option>Most Prayed</option>
              <option>Most Discussed</option>
            </select>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onPray={handlePray} />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-8">
            <button className="text-xs tracking-[0.14em] uppercase px-8 py-3 rounded-sm border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#E8C97A]"
              style={{ borderColor: "#E5E1D8", color: "#9CA3AF", fontFamily: BODY }}>
              Load More Testimonies
            </button>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="hidden xl:flex flex-col w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] py-6 px-4 overflow-y-auto feed-scroll space-y-4"
          style={{ borderLeft: "1px solid rgba(201,168,76,0.07)" }}>

          {/* Live location ticker */}
          <div className="rounded-sm border p-4" style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.25)" }}>
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Live · Recent Stories</p>
            <div className="space-y-2.5">
              {[
                { flag: "🇵🇭", city: "Manila", time: "2m ago", cat: "Healing" },
                { flag: "🇿🇦", city: "Cape Town", time: "7m ago", cat: "Answered Prayer" },
                { flag: "🇮🇳", city: "Mumbai", time: "12m ago", cat: "Protection" },
                { flag: "🇺🇸", city: "Atlanta", time: "18m ago", cat: "Provision" },
                { flag: "🇧🇷", city: "Recife", time: "24m ago", cat: "Restoration" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-base">{r.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs group-hover:text-[#E8C97A] transition-colors truncate" style={{ color: "#4B5563" }}>{r.city}</span>
                      <span className="text-[0.6rem]" style={{ color: "#D1D5DB" }}>· {r.time}</span>
                    </div>
                    <span className="text-[0.6rem]" style={{ color: "#9CA3AF" }}>{r.cat}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#C9A84C", boxShadow: "0 0 4px #C9A84C", animation: i === 0 ? "pulse 2s infinite" : "none" }} />
                </div>
              ))}
            </div>
          </div>

          <GlobalSnapshot />
          <SuggestedMembers />

          {/* Daily verse */}
          <div className="rounded-sm border p-4" style={{ background: "rgba(201,168,76,0.04)", borderColor: "rgba(201,168,76,0.3)" }}>
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-2">Today's Verse</p>
            <p className="text-sm italic font-light leading-relaxed" style={{ fontFamily: DISPLAY, color: "#4B5563" }}>
              "With God all things are possible."
            </p>
            <p className="text-[0.65rem] mt-2" style={{ color: "#9CA3AF" }}>Matthew 19:26</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
