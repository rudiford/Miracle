import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const DISPLAY = "'Cormorant Garamond', serif";
const BODY = "'Jost', sans-serif";

interface ApiPost {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  prayerCount: number;
  commentCount: number;
  createdAt: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", CA: "🇨🇦", GB: "🇬🇧", AU: "🇦🇺", NG: "🇳🇬", GH: "🇬🇭", KE: "🇰🇪",
  ZA: "🇿🇦", BR: "🇧🇷", MX: "🇲🇽", PH: "🇵🇭", IN: "🇮🇳", DE: "🇩🇪", FR: "🇫🇷",
  ES: "🇪🇸", IT: "🇮🇹", KR: "🇰🇷", JP: "🇯🇵", CN: "🇨🇳", ID: "🇮🇩",
};

function PostMini({ post }: { post: ApiPost }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = post.content.length > 240;
  const displayText = shouldTruncate && !expanded ? post.content.slice(0, 240) + "…" : post.content;

  return (
    <article
      className="rounded-sm border p-5"
      style={{ background: "#FFFFFF", borderColor: "#D6D3D1", fontFamily: BODY }}
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl.startsWith("http") ? post.imageUrl : post.imageUrl.startsWith("data:") ? post.imageUrl : `data:image/jpeg;base64,${post.imageUrl}`}
          alt="Post"
          className="w-full rounded-sm mb-3 object-cover max-h-72"
        />
      )}
      <p className="text-sm leading-relaxed" style={{ color: "#4B4B4B" }}>{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium mt-2 transition-colors"
          style={{ color: "#374151" }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid #F0EDE6" }}>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          🙏 {post.prayerCount ?? 0}
        </span>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          💬 {post.commentCount ?? 0}
        </span>
        {post.location && (
          <span className="text-xs" style={{ color: "#9CA3AF" }}>
            📍 {post.location}
          </span>
        )}
        <span className="text-xs ml-auto" style={{ color: "#C4C2BF" }}>
          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const userId = user?.id ?? null;
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useQuery<ApiPost[]>({
    queryKey: [`/api/users/${userId}/posts`],
    enabled: !!userId,
    staleTime: 0,
    queryFn: async () => {
      if (!userId) return [];
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/users/${userId}/posts`, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      if (!res.ok) {
        console.error("Failed to fetch posts:", res.status, await res.text());
        return [];
      }
      return res.json();
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Anonymous";
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const flag = user.country ? (COUNTRY_FLAGS[user.country] ?? "") : "";
  const locationParts = [user.city, user.state, flag || user.country].filter(Boolean);
  const totalPrayers = posts.reduce((sum, p) => sum + (p.prayerCount ?? 0), 0);
  const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : null;

  return (
    <div className="min-h-screen bg-[#F0F2F5]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Top nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3"
        style={{ background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #D6D3D1", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={() => setLocation("/")}
          className="text-sm flex items-center gap-2 transition-colors"
          style={{ color: "#6B7280" }}
        >
          ← Feed
        </button>
        <span className="text-lg tracking-widest font-semibold" style={{ fontFamily: DISPLAY, color: "#111111" }}>
          Proof of a Miracle
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/register")}
            className="text-xs px-4 py-2 rounded-sm border transition-all"
            style={{ borderColor: "#D6D3D1", color: "#374151" }}
          >
            Edit Profile
          </button>
          <button
            onClick={handleSignOut}
            className="text-xs px-4 py-2 rounded-sm transition-all"
            style={{ background: "#1A1A1A", color: "#FFFFFF" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">

        {/* Profile card */}
        <div
          className="rounded-sm border overflow-hidden mb-6"
          style={{ background: "#FFFFFF", borderColor: "#D6D3D1" }}
        >
          {/* Cover strip */}
          <div className="h-2 w-full" style={{ background: "linear-gradient(to right, #D6D3D1, #C9A84C44, #D6D3D1)" }} />

          <div className="p-8">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  style={{ border: "2px solid #D6D3D1" }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-light flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.12)", border: "2px solid #D6D3D1", color: "#111111", fontFamily: DISPLAY }}
                >
                  {initials}
                </div>
              )}

              {/* Name & location */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-light mb-1" style={{ fontFamily: DISPLAY, color: "#111111" }}>
                  {fullName}
                </h1>
                {locationParts.length > 0 && (
                  <p className="text-sm mb-1" style={{ color: "#6B7280" }}>
                    {locationParts.join(", ")}
                  </p>
                )}
                {user.email && (
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{user.email}</p>
                )}
                {joinedYear && (
                  <p className="text-xs mt-1" style={{ color: "#C4C2BF" }}>Member since {joinedYear}</p>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div
              className="flex items-center gap-8 mt-6 pt-5"
              style={{ borderTop: "1px solid #F0EDE6" }}
            >
              <div className="text-center">
                <div className="text-xl font-light" style={{ fontFamily: DISPLAY, color: "#111111" }}>{posts.length}</div>
                <div className="text-[0.65rem] tracking-widest uppercase mt-0.5" style={{ color: "#9CA3AF" }}>Testimonies</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light" style={{ fontFamily: DISPLAY, color: "#111111" }}>{totalPrayers.toLocaleString()}</div>
                <div className="text-[0.65rem] tracking-widest uppercase mt-0.5" style={{ color: "#9CA3AF" }}>Prayers Received</div>
              </div>
              {(user.gender || user.age) && (
                <div className="text-center">
                  <div className="text-xl font-light" style={{ fontFamily: DISPLAY, color: "#111111" }}>
                    {user.gender === "M" ? "Male" : user.gender === "F" ? "Female" : ""}{user.age ? ` · ${user.age}` : ""}
                  </div>
                  <div className="text-[0.65rem] tracking-widest uppercase mt-0.5" style={{ color: "#9CA3AF" }}>Profile</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts section */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[0.62rem] tracking-[0.2em] uppercase font-semibold" style={{ color: "#111111" }}>
            My Testimonies
          </p>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>{posts.length} shared</span>
        </div>

        {postsLoading ? (
          <div className="text-center py-12" style={{ color: "#9CA3AF" }}>
            <div className="text-2xl mb-2">🙏</div>
            <p className="text-sm">Loading your testimonies…</p>
          </div>
        ) : posts.length === 0 ? (
          <div
            className="rounded-sm border p-10 text-center"
            style={{ background: "#FFFFFF", borderColor: "#D6D3D1" }}
          >
            <p className="text-3xl mb-3" style={{ fontFamily: DISPLAY }}>✨</p>
            <p className="text-sm mb-1 font-medium" style={{ color: "#1A1A1A" }}>No testimonies yet</p>
            <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>Share your first miracle or answered prayer.</p>
            <button
              onClick={() => setLocation("/")}
              className="text-xs px-5 py-2 rounded-sm transition-all"
              style={{ background: "#1A1A1A", color: "#FFFFFF" }}
            >
              Share a Story
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => <PostMini key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
