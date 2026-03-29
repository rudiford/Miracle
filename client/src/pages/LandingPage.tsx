import { useState } from "react";
import { supabase } from "@/lib/supabase";

const DISPLAY = "'Cormorant Garamond', serif";
const BODY    = "'Jost', sans-serif";

const stories = [
  { category: "Healing", initials: "MT", name: "Margaret T.", location: "Nashville, TN",
    quote: "The doctors told us there was no explanation. I knew exactly what had happened — I had been praying for three years." },
  { category: "Answered Prayer", initials: "DO", name: "David O.", location: "Lagos, Nigeria",
    quote: "I had lost everything — my job, my home. A stranger knocked on my door the next morning with exactly what I needed." },
  { category: "Divine Guidance", initials: "RL", name: "Rosa L.", location: "São Paulo, Brazil",
    quote: "Something made me turn back. I don't know why. The car accident happened fifty feet ahead, moments later." },
  { category: "Restoration", initials: "PH", name: "Patricia H.", location: "Birmingham, UK",
    quote: "My estranged son called after eleven years of silence — on the exact day I had surrendered him to God in prayer." },
  { category: "Protection", initials: "JK", name: "James K.", location: "Nairobi, Kenya",
    quote: "The fire consumed every apartment except ours. My daughter had prayed specifically over our doorway that morning." },
  { category: "Provision", initials: "AV", name: "Ana V.", location: "Mexico City, MX",
    quote: "We had $4 left and a family of six. By evening an envelope arrived in the mail with no return address." },
];

const steps = [
  { n: "01", title: "Create Your Profile",
    desc: "Sign up free in seconds. Share a little about your faith background — all traditions are welcome here." },
  { n: "02", title: "Share Your Story",
    desc: "Write your testimony. Add photos, location, and context so your miracle is remembered fully." },
  { n: "03", title: "Connect & Encourage",
    desc: "Follow others, comment, pray alongside members, and be part of a global community of faith." },
  { n: "04", title: "Strengthen Faith",
    desc: "Reading real testimonies builds faith. When you see what God did for others, your own belief deepens." },
];

const categoryColors: Record<string, string> = {
  Healing: "#7EC8A4",
  Provision: "#C9A84C",
  "Divine Guidance": "#A49BCC",
  Protection: "#6BAED6",
  Restoration: "#E8A87C",
  "Answered Prayer": "#E8C97A",
  "Spiritual Encounter": "#C97AB8",
};

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, initialMode = 'signup' }: { onClose: () => void; initialMode?: 'login' | 'signup' }) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg('Check your email to confirm your account, then log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-sm"
        style={{ background: "#fff", border: "1px solid #D6D3D1", padding: "32px", fontFamily: BODY }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9CA3AF", lineHeight: 1 }}
        >×</button>

        <h2 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 300, color: "#111111", textAlign: "center", marginBottom: 4 }}>
          {mode === 'signup' ? 'Join the Community' : 'Welcome Back'}
        </h2>
        <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 24 }}>
          {mode === 'signup' ? 'Free forever · All traditions welcome' : 'Sign in to your account'}
        </p>

        {successMsg ? (
          <p style={{ fontSize: 13, color: "#C9A84C", textAlign: "center", padding: "16px 0" }}>{successMsg}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "10px 14px", border: "1px solid #D6D3D1", borderRadius: 4, fontSize: 13, fontFamily: BODY, color: "#111", outline: "none", background: "#FAFAF8" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ padding: "10px 14px", border: "1px solid #D6D3D1", borderRadius: 4, fontSize: 13, fontFamily: BODY, color: "#111", outline: "none", background: "#FAFAF8" }}
            />
            {errorMsg && <p style={{ fontSize: 12, color: "#DC2626" }}>{errorMsg}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: "10px 0", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontFamily: BODY, letterSpacing: "0.1em", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>
        )}

        <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 20 }}>
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} style={{ color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Sign in</button>
            </>
          ) : (
            <>New here?{' '}
              <button onClick={() => setMode('signup')} style={{ color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Create account</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3EF", color: "#1A1A1A", fontFamily: BODY }}>
      {authMode && <AuthModal onClose={() => setAuthMode(null)} initialMode={authMode} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { font-size: 12px; color: #6B7280; text-decoration: none; letter-spacing: 0.1em; }
        .story-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero-title { font-size: 2.8rem !important; }
          .hero-buttons { flex-direction: column; align-items: stretch; }
          .hero-buttons a, .hero-buttons button { text-align: center; }
          .story-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
          .nav-inner { padding: 12px 16px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav-inner" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #D6D3D1",
        backdropFilter: "blur(8px)", padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 20, color: "#111111", fontWeight: 300, letterSpacing: 2 }}>
          Proof of a Miracle
        </span>
        <div className="nav-links">
          {[
            { label: "Stories", href: "#stories" },
            { label: "How It Works", href: "#how" },
            { label: "Community", href: "#community" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: BODY }}>
              {label}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{ fontSize: 12, color: "#374151", background: "transparent", border: "1px solid #D6D3D1", borderRadius: 4, padding: "8px 16px", cursor: "pointer", letterSpacing: "0.1em", fontFamily: BODY }}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              style={{ fontSize: 12, color: "#fff", background: "#1A1A1A", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer", letterSpacing: "0.1em", fontFamily: BODY }}
            >
              JOIN FREE
            </button>
          </div>
          <span style={{ fontSize: 12, color: "#4CAF50", letterSpacing: "0.05em", fontFamily: BODY }}>
            coincidentally created by a non-religious webcreator
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "120px 24px 80px",
      }}>
        <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 24 }}>
          A Faith Community for Every Believer
        </p>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: "clamp(3rem,8vw,6rem)", fontWeight: 300,
          lineHeight: 1.05, color: "#111111", maxWidth: 800, margin: "0 0 24px",
        }}>
          Your miracle<br />
          <em style={{ fontStyle: "italic", color: "#C9A84C" }}>deserves to be</em><br />
          heard.
        </h1>
        <div style={{ width: 48, height: 1, background: "linear-gradient(to right, transparent, #C9A84C, transparent)", margin: "0 auto 24px" }} />
        <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 420, lineHeight: 1.7, marginBottom: 40 }}>
          Share the moments where faith met reality. Connect with believers across every tradition who have witnessed the extraordinary in ordinary life.
        </p>
        <div className="hero-buttons" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setAuthMode('signup')}
            style={{ padding: "12px 32px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, letterSpacing: "0.12em", cursor: "pointer", fontFamily: BODY }}
          >
            SHARE YOUR STORY
          </button>
          <a
            href="#stories"
            style={{ padding: "12px 32px", background: "transparent", color: "#6B7280", border: "1px solid #D6D3D1", borderRadius: 4, fontSize: 12, letterSpacing: "0.12em", textDecoration: "none", fontFamily: BODY }}
          >
            READ TESTIMONIES
          </a>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section id="stories" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", marginBottom: 8 }}>Community Testimonies</p>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#111111", textAlign: "center", marginBottom: 48 }}>
            Stories of the Extraordinary
          </h2>
          <div className="story-grid">
            {stories.map((s) => {
              const color = categoryColors[s.category] || "#C9A84C";
              return (
                <div key={s.name} style={{
                  background: "#FFFFFF", border: "1px solid #D6D3D1", borderRadius: 4,
                  padding: 24, display: "flex", flexDirection: "column", gap: 16,
                  borderTop: `3px solid ${color}`,
                }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color, margin: 0 }}>{s.category}</p>
                  <p style={{ fontFamily: DISPLAY, fontSize: 17, fontStyle: "italic", fontWeight: 300, color: "#1A1A1A", lineHeight: 1.6, margin: 0 }}>
                    "{s.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,0.12)",
                      border: "1px solid #D6D3D1", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: DISPLAY, fontSize: 14, color: "#111",
                    }}>{s.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>📍 {s.location}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "80px 24px", background: "#F5F3EF" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", textAlign: "center", marginBottom: 8 }}>Getting Started</p>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "#111111", textAlign: "center", marginBottom: 56 }}>
            Your Voice Matters Here
          </h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 300, color: "rgba(201,168,76,0.3)", lineHeight: 1, marginBottom: 16 }}>
                  {s.n}
                </div>
                <div style={{ width: 28, height: 1, background: "#C9A84C", margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 400, color: "#111", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE ── */}
      <section style={{ padding: "72px 24px", background: "#fff", borderTop: "1px solid #D6D3D1", borderBottom: "1px solid #D6D3D1" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem,3vw,2.2rem)", fontStyle: "italic", fontWeight: 300, color: "#111111", lineHeight: 1.6, marginBottom: 16 }}>
            "Faith is the substance of things hoped for, the evidence of things not seen."
          </p>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A84C" }}>
            Hebrews 11:1 · Open to all traditions and denominations
          </p>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section id="community" style={{ padding: "96px 24px", background: "#F5F3EF", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12 }}>Join the Community</p>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "#111111", marginBottom: 16 }}>
            Begin sharing your story today.
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 36 }}>
            Your testimony could be exactly what someone needs to hear. Share it with believers around the world.
          </p>
          <button
            onClick={() => setAuthMode('signup')}
            style={{ padding: "14px 40px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, letterSpacing: "0.12em", cursor: "pointer", fontFamily: BODY }}
          >
            JOIN FREE
          </button>
          <p style={{ fontSize: 11, color: "#C4C2BF", marginTop: 16 }}>
            No credit card required · All denominations welcome
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-inner" style={{
        padding: "24px 32px", borderTop: "1px solid #D6D3D1", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 18, color: "#111111", fontWeight: 300 }}>Proof of a Miracle</span>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#C4C2BF", margin: 0 }}>© 2026 Proof of a Miracle</p>
      </footer>
    </div>
  );
}
