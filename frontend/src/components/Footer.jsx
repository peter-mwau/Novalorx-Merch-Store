import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useTheme } from "../contexts/themeContext.jsx";
import { BsGithub, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

const SHOP_LINKS = [
  { label: "Caps", href: "/shop/caps" },
  { label: "T-Shirts", href: "/shop/t-shirts" },
  { label: "Hoodies", href: "/shop/hoodies" },
  { label: "Notebooks", href: "/shop/notebooks" },
  { label: "Diaries", href: "/shop/diaries" },
  { label: "Pens", href: "/shop/pens" },
  { label: "Bookmarks", href: "/shop/bookmarks" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIALS = [
  {
    icon: <BsInstagram size={16} />,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: <BsTwitter size={16} />,
    href: "https://twitter.com",
    label: "Twitter",
  },
  { icon: <BsGithub size={16} />, href: "https://github.com", label: "GitHub" },
  {
    icon: <LiaLinkedin size={16} />,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: <BsYoutube size={16} />,
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export default function Footer() {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      // TODO: POST to your newsletter endpoint
      // await fetch(`${API_URL}/newsletter`, { method: "POST", ... });
      await new Promise((r) => setTimeout(r, 600));
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } finally {
      setSubscribing(false);
    }
  };

  /* ─── Style tokens (match AuthModal + Navbar + Profile) ─── */
  const surface = isDark
    ? "bg-slate-950/70 ring-white/10 text-white"
    : "bg-white/80 ring-slate-200 text-slate-900";

  const muted = isDark ? "text-slate-400" : "text-slate-500";

  const linkBase = `text-sm tracking-tight transition-colors ${
    isDark
      ? "text-slate-400 hover:text-white"
      : "text-slate-600 hover:text-slate-900"
  }`;

  const heading = `text-xs font-semibold uppercase tracking-wider ${
    isDark ? "text-slate-500" : "text-slate-400"
  }`;

  const iconBtn = `grid h-9 w-9 place-items-center rounded-xl ring-1 transition ${
    isDark
      ? "bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white"
      : "bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100 hover:text-slate-900"
  }`;

  const input = `w-full rounded-xl px-3.5 py-2.5 pr-11 text-sm outline-none ring-1 transition ${
    isDark
      ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500 focus:ring-cyan-400/70"
      : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-cyan-500"
  }`;

  const divider = isDark ? "bg-white/10" : "bg-slate-200";

  return (
    <footer className="relative mt-auto px-4 pb-6 pt-12">
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl ring-1 backdrop-blur-xl ${surface} shadow-xl ${
          isDark ? "shadow-black/30" : "shadow-slate-900/5"
        }`}
      >
        {/* Signature glow blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            color: isDark ? "#67e8f9" : "#0891b2",
          }}
        />

        <div className="relative p-8 sm:p-10">
          {/* Top: brand + link columns */}
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/Novalorx_mini_logo.png"
                  alt="Novalorx Labs"
                  className="h-10 w-10 shadow shadow-cyan-500/30 rounded-full object-cover p-1"
                />
                <span className="text-base font-semibold tracking-tight">
                  Novalorx Labs
                </span>
              </Link>

              <p className={`mt-4 max-w-xs text-sm leading-relaxed ${muted}`}>
                Lab-tested apparel, notebooks, and accessories for curious
                minds. Engineered in the lab, worn everywhere.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={iconBtn}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className={heading}>Shop</h3>
              <ul className="mt-4 space-y-2.5">
                {SHOP_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className={linkBase}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className={heading}>Company</h3>
              <ul className="mt-4 space-y-2.5">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className={linkBase}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className={heading}>Stay in the loop</h3>
              <p className={`mt-4 text-sm leading-relaxed ${muted}`}>
                Get new drops, restocks, and lab notes. No spam.
              </p>

              <form onSubmit={handleSubscribe} className="mt-4">
                <div className="relative">
                  <Mail
                    size={15}
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@lab.com"
                    className={`${input} pl-9`}
                  />
                  <button
                    type="submit"
                    disabled={subscribing || subscribed}
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {subscribing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </button>
                </div>

                {subscribed && (
                  <p className="mt-2 text-xs font-medium text-emerald-500">
                    You're subscribed. Welcome to the lab.
                  </p>
                )}
              </form>

              <p
                className={`mt-3 text-[11px] leading-relaxed ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                By subscribing you agree to our{" "}
                <Link to="/privacy" className="text-cyan-500 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className={`my-8 h-px ${divider}`} />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className={`text-xs ${muted}`}>
              &copy; {new Date().getFullYear()} Novalorx Labs. All rights
              reserved.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className={muted}>Built for curious minds</span>
              <span className="h-1 w-1 rounded-full bg-cyan-500" />
              <span className="text-cyan-500">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
