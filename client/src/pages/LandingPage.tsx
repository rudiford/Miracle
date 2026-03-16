import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// ── Starfield Canvas ──────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    type Star = {
      x: number; y: number; r: number;
      alpha: number; speed: number; phase: number;
    };

    let stars: Star[] = [];
    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 5500) },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2,
          alpha: Math.random() * 0.55 + 0.1,
          speed: Math.random() * 0.003 + 0.001,
          phase: Math.random() * Math.PI * 2,
        })
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame += 0.01;
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(frame * s.speed * 100 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,220,${a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            const children = e.target.querySelectorAll<HTMLElement>(
              ".story-card, .step-item, .cat-pill"
            );
            children.forEach((c, i) => {
              c.style.transitionDelay = `${i * 0.08}s`;
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Data ──────────────────────────────────────────────────────────────────────
const stories = [
  { category: "Healing", initials: "M", name: "Margaret T.", location: "Nashville, TN",
    quote: "The doctors told us there was no explanation. I knew exactly what had happened — I had been praying for three years." },
  { category: "Answered Prayer", initials: "D", name: "David O.", location: "Lagos, Nigeria",
    quote: "I had lost everything — my job, my home. A stranger knocked on my door the next morning with exactly what I needed." },
  { category: "Divine Guidance", initials: "R", name: "Rosa L.", location: "São Paulo, Brazil",
    quote: "Something made me turn back. I don't know why. The car accident happened fifty feet ahead, moments later." },
  { category: "Restoration", initials: "P", name: "Patricia H.", location: "Birmingham, UK",
    quote: "My estranged son called after eleven years of silence — on the exact day I had surrendered him to God in prayer." },
  { category: "Protection", initials: "J", name: "James K.", location: "Nairobi, Kenya",
    quote: "The fire consumed every apartment except ours. My daughter had prayed specifically over our doorway that morning." },
  { category: "Provision", initials: "A", name: "Ana V.", location: "Mexico City, MX",
    quote: "We had $4 left and a family of six. By evening an envelope arrived in the mail with no return address." },
];

const steps = [
  { n: "01", title: "Create Your Profile",
    desc: "Sign up free in seconds. Share a little about your faith background — all traditions are welcome here." },
  { n: "02", title: "Share Your Story",
    desc: "Write, record, or upload your testimony. Add photos, dates, and context so your miracle is remembered fully." },
  { n: "03", title: "Connect & Encourage",
    desc: "Follow others, comment, pray alongside members, and join groups aligned with your denomination or interest." },
  { n: "04", title: "Strengthen Faith",
    desc: "Reading verified testimonies builds faith. When you see what God did for others, your own belief deepens." },
];

const categories = [
  { icon: "🕊️", label: "Healing" },
  { icon: "🙏", label: "Answered Prayer" },
  { icon: "⭐", label: "Divine Guidance" },
  { icon: "🛡️", label: "Protection" },
  { icon: "💛", label: "Provision" },
  { icon: "🌿", label: "Restoration" },
  { icon: "🔥", label: "Spiritual Encounter" },
  { icon: "🤝", label: "Reconciliation" },
  { icon: "🌅", label: "Near-Death" },
  { icon: "✨", label: "Other Wonders" },
];

const DISPLAY = "'Cormorant Garamond', serif";
const BODY    = "'Jost', sans-serif";

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
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
        // Auth state change in useAuth will handle redirect
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1A1A28] border border-[rgba(201,168,76,0.25)] rounded-sm p-8 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[rgba(240,237,230,0.4)] hover:text-[#E8C97A] text-xl bg-transparent border-0 cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-2xl font-light text-[#F7F2E8] mb-1 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {mode === 'signup' ? 'Join the Community' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-[rgba(240,237,230,0.4)] text-center mb-6">
          {mode === 'signup' ? 'Free forever · All traditions welcome' : 'Sign in to your account'}
        </p>

        {successMsg ? (
          <p className="text-sm text-[#C9A84C] text-center py-4">{successMsg}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-[#0D0D12] border border-[rgba(201,168,76,0.2)] rounded-sm text-[#F0EDE6] text-sm outline-none focus:border-[#C9A84C]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="px-4 py-3 bg-[#0D0D12] border border-[rgba(201,168,76,0.2)] rounded-sm text-[#F0EDE6] text-sm outline-none focus:border-[#C9A84C]"
            />
            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 px-6 py-3 bg-[#C9A84C] text-[#0D0D12] text-xs font-medium tracking-[0.15em] uppercase rounded-sm border-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        )}

        <p className="text-xs text-[rgba(240,237,230,0.35)] text-center mt-5">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#C9A84C] bg-transparent border-0 cursor-pointer underline text-xs">Sign in</button>
            </>
          ) : (
            <>New here?{' '}
              <button onClick={() => setMode('signup')} className="text-[#C9A84C] bg-transparent border-0 cursor-pointer underline text-xs">Create account</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  useReveal();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#F0EDE6] overflow-x-hidden">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <StarField />

      {/* Fonts & global animation styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        body { font-family: 'Jost', sans-serif; }

        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.8s ease,transform 0.8s ease; }
        .reveal.revealed { opacity:1; transform:translateY(0); }

        .hero-eyebrow { animation:fadeUp 1s 0.3s both; }
        .hero-title   { animation:fadeUp 1.1s 0.5s both; }
        .hero-divider { animation:fadeUp 1s 0.8s both; }
        .hero-sub     { animation:fadeUp 1s 1.0s both; }
        .hero-actions { animation:fadeUp 1s 1.2s both; }
        .scroll-hint  { animation:fadeUp 1s 1.8s both; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:0.3; }
          50%     { opacity:1; }
        }
        .scroll-line { animation:scrollPulse 2s 2s infinite; }

        .story-card { transition:border-color 0.3s,transform 0.3s; position:relative; overflow:hidden; }
        .story-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(to right,transparent,#C9A84C,transparent);
          opacity:0; transition:opacity 0.3s;
        }
        .story-card:hover { border-color:rgba(201,168,76,0.4)!important; transform:translateY(-4px); }
        .story-card:hover::before { opacity:1; }

        .cat-pill { transition:all 0.3s; }
        .cat-pill:hover { border-color:#C9A84C!important; color:#E8C97A!important; background:rgba(201,168,76,0.1)!important; }

        .btn-primary { transition:background 0.3s,transform 0.2s; }
        .btn-primary:hover { background:#E8C97A!important; transform:translateY(-2px); }
        .btn-ghost { transition:border-color 0.3s,color 0.3s; }
        .btn-ghost:hover { border-color:#C9A84C!important; color:#E8C97A!important; }
        .nav-link { transition:color 0.3s; }
        .nav-link:hover { color:#E8C97A!important; }
        .nav-cta { transition:background 0.3s,color 0.3s; }
        .nav-cta:hover { background:#C9A84C!important; color:#0D0D12!important; }
        .footer-link { transition:color 0.3s; }
        .footer-link:hover { color:#E8C97A!important; }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background:"linear-gradient(to bottom,rgba(13,13,18,0.95),transparent)", backdropFilter:"blur(2px)" }}
      >
        <a href="#" className="text-xl font-normal tracking-widest text-[#E8C97A] no-underline"
          style={{ fontFamily:DISPLAY }}>
          Proof of a Miracle
        </a>
        <ul className="hidden md:flex gap-9 list-none m-0 p-0">
          {[
            { label:"Stories",     href:"#stories-section" },
            { label:"How It Works",href:"#how-it-works" },
            { label:"Categories",  href:"#categories" },
            { label:"Community",   href:"#community" },
          ].map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="nav-link text-xs tracking-[0.14em] uppercase text-[rgba(240,237,230,0.55)] no-underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowAuth(true)}
          className="nav-cta text-xs tracking-[0.12em] uppercase px-5 py-2 border border-[#C9A84C] text-[#E8C97A] rounded-sm bg-transparent cursor-pointer">
          Join Free
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[600px] pointer-events-none"
          style={{ background:"radial-gradient(ellipse 60% 70% at 50% 0%,rgba(201,168,76,0.08) 0%,transparent 70%)" }} />

        <p className="hero-eyebrow text-[0.7rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-7">
          A Faith Community for Every Believer
        </p>
        <h1 className="hero-title text-[clamp(3.2rem,9vw,7.5rem)] font-light leading-none text-[#F7F2E8] max-w-4xl"
          style={{ fontFamily:DISPLAY }}>
          Your miracle<br />
          <em className="italic text-[#E8C97A]">deserves to be</em><br />
          heard.
        </h1>
        <div className="hero-divider w-14 h-px my-10 mx-auto"
          style={{ background:"linear-gradient(to right,transparent,#C9A84C,transparent)" }} />
        <p className="hero-sub text-base font-light leading-relaxed text-[rgba(240,237,230,0.55)] max-w-md"
          style={{ fontFamily:BODY }}>
          Share the moments where faith met reality. Connect with believers across every tradition
          who have witnessed the extraordinary in ordinary life.
        </p>
        <div className="hero-actions flex gap-4 mt-10 flex-wrap justify-center">
          <button
            onClick={() => setShowAuth(true)}
            className="btn-primary px-9 py-3 bg-[#C9A84C] text-[#0D0D12] text-xs font-medium tracking-[0.15em] uppercase rounded-sm border-0 cursor-pointer">
            Share Your Story
          </button>
          <a href="#stories-section"
            className="btn-ghost px-9 py-3 border border-[rgba(240,237,230,0.25)] text-[rgba(240,237,230,0.55)] text-xs tracking-[0.15em] uppercase rounded-sm no-underline">
            Read Testimonies
          </a>
        </div>
        <div className="scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(240,237,230,0.4)]">Explore</span>
          <div className="scroll-line w-px h-10"
            style={{ background:"linear-gradient(to bottom,#C9A84C,transparent)" }} />
        </div>
      </section>

      {/* ── STORIES ── */}
      <section id="stories-section" className="relative z-10 py-24 px-6 text-center">
        <div className="reveal">
          <p className="text-[0.68rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-3">Community Testimonies</p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F7F2E8] mb-3"
            style={{ fontFamily:DISPLAY }}>
            Stories of the Extraordinary
          </h2>
          <p className="text-sm text-[rgba(240,237,230,0.55)] max-w-md mx-auto leading-relaxed mb-14">
            Real accounts from real people — healings, answered prayers, divine timing,
            and moments that changed everything.
          </p>
        </div>
        <div className="reveal grid gap-5 max-w-5xl mx-auto"
          style={{ gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))" }}>
          {stories.map((s) => (
            <div key={s.name}
              className="story-card bg-[#1A1A28] border border-[rgba(201,168,76,0.12)] rounded-sm p-8 text-left cursor-pointer">
              <p className="text-[0.62rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">{s.category}</p>
              <p className="text-xl italic font-light leading-relaxed text-[#F7F2E8] mb-6"
                style={{ fontFamily:DISPLAY }}>"{s.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#21213A] border border-[rgba(201,168,76,0.15)] flex items-center justify-center text-base text-[#E8C97A]"
                  style={{ fontFamily:DISPLAY }}>{s.initials}</div>
                <div>
                  <div className="text-xs text-[rgba(240,237,230,0.55)]">{s.name}</div>
                  <div className="text-[0.7rem] text-[rgba(240,237,230,0.3)]">{s.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 bg-[#14141F]">
        <div className="max-w-4xl mx-auto">
          <div className="reveal text-center">
            <p className="text-[0.68rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-3">Getting Started</p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F7F2E8] mb-3"
              style={{ fontFamily:DISPLAY }}>Your Voice Matters Here</h2>
            <p className="text-sm text-[rgba(240,237,230,0.55)] max-w-md mx-auto leading-relaxed">
              Join a community built on honesty, faith, and the courage to share what you've seen.
            </p>
          </div>
          <div className="reveal grid gap-12 mt-16"
            style={{ gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))" }}>
            {steps.map((s) => (
              <div key={s.n} className="step-item flex flex-col items-center text-center">
                <div className="text-6xl font-light text-[rgba(201,168,76,0.2)] leading-none relative"
                  style={{ fontFamily:DISPLAY }}>
                  {s.n}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-px bg-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-normal text-[#F7F2E8] mt-6 mb-2" style={{ fontFamily:DISPLAY }}>
                  {s.title}
                </h3>
                <p className="text-sm text-[rgba(240,237,230,0.55)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="relative z-10 py-24 px-6 text-center">
        <div className="reveal">
          <p className="text-[0.68rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-3">Browse by Experience</p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F7F2E8] mb-3"
            style={{ fontFamily:DISPLAY }}>Every Kind of Miracle</h2>
          <p className="text-sm text-[rgba(240,237,230,0.55)] max-w-md mx-auto leading-relaxed mb-12">
            From physical healing to divine timing — find stories in the category that speaks to your heart.
          </p>
        </div>
        <div className="reveal grid gap-3 max-w-3xl mx-auto"
          style={{ gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))" }}>
          {categories.map((c) => (
            <div key={c.label}
              className="cat-pill flex flex-col items-center gap-2 px-4 py-5 border border-[rgba(201,168,76,0.15)] bg-[#1A1A28] rounded-sm text-xs tracking-wide text-[rgba(240,237,230,0.55)] cursor-pointer">
              <span className="text-2xl">{c.icon}</span>
              {c.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── SCRIPTURE BANNER ── */}
      <section className="relative z-10 py-24 px-6 bg-[#1A1A28] border-y border-[rgba(201,168,76,0.12)]">
        <div className="reveal max-w-2xl mx-auto text-center">
          <p className="text-[clamp(1.5rem,4vw,2.5rem)] italic font-light text-[#F7F2E8] leading-relaxed mb-5"
            style={{ fontFamily:DISPLAY }}>
            "Faith is the substance of things hoped for, the evidence of things not seen."
          </p>
          <p className="text-xs tracking-[0.18em] uppercase text-[#C9A84C]">
            Hebrews 11:1 — Open to all traditions, denominations, and backgrounds.
          </p>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section id="community" className="relative z-10 py-32 px-6 text-center">
        <div className="reveal max-w-lg mx-auto">
          <p className="text-[0.68rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-3">Join the Community</p>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light text-[#F7F2E8] mb-4"
            style={{ fontFamily:DISPLAY }}>
            Begin sharing your story today.
          </h2>
          <p className="text-sm text-[rgba(240,237,230,0.55)] leading-relaxed mb-10">
            Thousands of members have already shared moments of grace. Your testimony could
            be exactly what someone needs to hear.
          </p>

          <div className="flex gap-3 max-w-sm mx-auto flex-wrap justify-center mb-5">
            <button
              className="btn-primary px-9 py-3 bg-[#C9A84C] text-[#0D0D12] text-xs font-medium tracking-[0.15em] uppercase rounded-sm border-0 cursor-pointer"
              onClick={() => setShowAuth(true)}
            >
              Join Free
            </button>
          </div>
          <p className="text-[0.7rem] text-[rgba(240,237,230,0.25)]">
            No credit card required · Faith-safe community · All denominations welcome
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-between flex-wrap gap-6">
        <a href="#" className="text-lg text-[#E8C97A] no-underline" style={{ fontFamily:DISPLAY }}>
          Proof of a Miracle
        </a>
        <ul className="flex gap-7 list-none m-0 p-0 flex-wrap">
          {["About","Community Guidelines","Privacy","Terms","Contact"].map((l) => (
            <li key={l}>
              <a href="#" className="footer-link text-[0.7rem] tracking-[0.12em] uppercase text-[rgba(240,237,230,0.4)] no-underline">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[0.7rem] text-[rgba(240,237,230,0.2)] m-0">© 2026 Proof of a Miracle</p>
      </footer>
    </div>
  );
}
