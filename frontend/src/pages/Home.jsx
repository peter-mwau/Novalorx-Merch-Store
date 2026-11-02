import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  BookOpen,
  FlaskConical,
  NotebookPen,
  Package,
  Sparkles,
  Star,
  Truck,
  Undo2,
  ShieldCheck,
  TestTube,
  Zap,
} from "lucide-react";
import { useProducts } from "../contexts/productsContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";

const FEATURED_FALLBACK = [
  {
    id: "tee",
    name: "Novalorx Logo Tee",
    slug: "novalorx-logo-tee",
    priceCents: 24,
    currency: "USD",
  },
  {
    id: "hoodie",
    name: "Lab Hoodie",
    slug: "lab-hoodie",
    priceCents: 54,
    currency: "USD",
  },
  {
    id: "notebook",
    name: "Grid Notebook",
    slug: "grid-notebook",
    priceCents: 18,
    currency: "USD",
  },
];

const CATEGORIES = [
  { name: "Caps", slug: "caps", icon: Sparkles, count: 6 },
  { name: "T-Shirts", slug: "t-shirts", icon: Star, count: 12 },
  { name: "Hoodies", slug: "hoodies", icon: Beaker, count: 4 },
  { name: "Notebooks", slug: "notebooks", icon: NotebookPen, count: 8 },
  { name: "Diaries", slug: "diaries", icon: BookOpen, count: 5 },
  { name: "Pens", slug: "pens", icon: Package, count: 9 },
];

const MARQUEE_ITEMS = [
  "Free shipping over $75",
  "New drop every Friday",
  "30-day returns",
  "Lab-tested materials",
  "Ships worldwide",
  "Engineered in Nairobi",
];

export default function Home() {
  const { getPriceDetails } = useProducts();
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [featured, setFeatured] = useState(FEATURED_FALLBACK);

  useEffect(() => {
    fetch("/api/products?limit=3&isFeatured=true&isActive=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.products) && data.products.length) {
          setFeatured(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heroProduct = featured[0];
  const heroImage = heroProduct?.images?.[0]?.url || heroProduct?.imageUrl;

  const panel = `relative overflow-hidden rounded-3xl ring-1 backdrop-blur-xl ${
    isDark
      ? "bg-slate-950/70 ring-white/10 text-white"
      : "bg-white/80 ring-slate-200 text-slate-900"
  } shadow-lg ${isDark ? "shadow-black/30" : "shadow-slate-900/5"}`;

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-x-clip pb-16">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-[40rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pt-28">
        {/* ═══════════════ ASYMMETRIC HERO ═══════════════ */}
        <section className="grid items-end gap-6 lg:grid-cols-12">
          {/* Big type block */}
          <div className="lg:col-span-7">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
                  : "bg-cyan-500/10 text-cyan-600 ring-cyan-500/30"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
              </span>
              New drops in the lab · Vol. 04
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl">
              Science
              <br />
              you can{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                  wear.
                </span>
                {/* Hand-drawn underline */}
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-cyan-500"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8c40-4 80-6 120-4 20 1 40 3 60 1"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className={`mt-8 max-w-md text-base leading-relaxed ${muted}`}>
              Apparel, notebooks, and accessories for curious minds. Lab-tested.
              Street-ready. Built to survive the commute and the coffee spill.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              >
                Shop the collection
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/about"
                className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ring-1 transition ${
                  isDark
                    ? "text-slate-200 ring-white/10 hover:bg-white/5"
                    : "text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                Our story
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Hero product card — overlaps on purpose */}
          <div className="relative lg:col-span-5">
            {/* Decorative rotated square behind */}
            <div className="absolute -right-6 -top-6 h-32 w-32 rotate-12 rounded-3xl bg-cyan-500/10 ring-1 ring-cyan-500/20" />
            <div className="absolute -left-4 -bottom-4 h-24 w-24 -rotate-6 rounded-2xl bg-cyan-500/5 ring-1 ring-cyan-500/10" />

            <div className={`${panel} aspect-[4/5] lg:-mt-12`}>
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                      color: isDark ? "#67e8f9" : "#0891b2",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                      <FlaskConical size={40} />
                    </div>
                    <p className="text-base font-semibold tracking-tight">
                      {heroProduct?.name || "Novalorx Labs"}
                    </p>
                    <p
                      className={`max-w-[200px] text-xs leading-relaxed ${muted}`}
                    >
                      Engineered in the lab. Worn everywhere.
                    </p>
                  </div>
                </>
              )}

              {/* Bottom overlay if real product */}
              {heroImage && heroProduct && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                  <p className="text-xs uppercase tracking-wider text-white/70">
                    Featured
                  </p>
                  <p className="mt-1 truncate text-lg font-semibold text-white">
                    {heroProduct.name}
                  </p>
                  <Link
                    to={`/product/${heroProduct.slug || heroProduct.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    Shop now <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {/* Corner brackets */}
              <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-tl-2xl border-l-2 border-t-2 border-cyan-500/40" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 rounded-br-2xl border-b-2 border-r-2 border-cyan-500/40" />
            </div>
          </div>
        </section>

        {/* ═══════════════ MARQUEE TICKER ═══════════════ */}
        <section className="relative -mx-4 mt-16 overflow-hidden border-y border-dashed border-slate-200/70 py-4 dark:border-white/10">
          <div className="flex animate-[marquee_38s_linear_infinite] gap-10 whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <span className="h-1 w-1 rounded-full bg-cyan-500" />
                {item}
              </span>
            ))}
          </div>
          {/* Inline keyframes — put in globals.css if you prefer */}
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* ═══════════════ CATEGORIES (bento) ═══════════════ */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Browse · 6 categories
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Pick your lab
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-cyan-500 transition hover:text-cyan-400"
            >
              View all
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2">
            {/* Big card */}
            <Link
              to={`/shop/${CATEGORIES[1].slug}`}
              className={`group relative col-span-2 row-span-2 overflow-hidden rounded-3xl p-8 ring-1 transition hover:-translate-y-0.5 ${
                isDark
                  ? "bg-gradient-to-br from-cyan-500/15 via-white/[0.03] to-white/[0.03] ring-white/10"
                  : "bg-gradient-to-br from-cyan-500/10 via-white to-slate-50 ring-slate-200"
              }`}
            >
              <div className="pointer-events-none absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                  <Star size={22} />
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wider ${muted}`}>
                    Bestseller
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                    T-Shirts
                  </h3>
                  <p className={`mt-1 text-sm ${muted}`}>
                    {CATEGORIES[1].count} styles · from $24
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-500">
                    Shop now{" "}
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>

            {/* Tall card */}
            <Link
              to={`/shop/${CATEGORIES[2].slug}`}
              className={`group relative row-span-2 overflow-hidden rounded-3xl p-6 ring-1 transition hover:-translate-y-0.5 ${
                isDark
                  ? "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]"
                  : "bg-white ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5"
              }`}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20 transition group-hover:bg-cyan-500 group-hover:text-white">
                  <Beaker size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Hoodies
                  </h3>
                  <p className={`mt-1 text-xs ${muted}`}>
                    {CATEGORIES[2].count} styles
                  </p>
                </div>
              </div>
            </Link>

            {/* Small tiles */}
            {[CATEGORIES[0], CATEGORIES[3], CATEGORIES[4], CATEGORIES[5]].map(
              ({ name, slug, icon: Icon, count }) => (
                <Link
                  key={slug}
                  to={`/shop/${slug}`}
                  className={`group relative overflow-hidden rounded-3xl p-5 ring-1 transition hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]"
                      : "bg-white ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20 transition group-hover:bg-cyan-500 group-hover:text-white">
                      <Icon size={16} />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider ${muted}`}
                    >
                      {count}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold tracking-tight">
                    {name}
                  </p>
                </Link>
              ),
            )}
          </div>
        </section>

        {/* ═══════════════ FEATURED (large, editorial) ═══════════════ */}
        <section className="mt-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Featured this week
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Fresh from the lab
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-cyan-500 transition hover:text-cyan-400"
            >
              Shop all
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featured.slice(0, 3).map((product, idx) => {
              const image =
                product.images?.[0]?.url || product.imageUrl || null;
              const price = getPriceDetails(product);
              // First card is 2-col wide on lg
              const span = idx === 0 ? "lg:col-span-1 lg:row-span-2" : "";
              const aspect = idx === 0 ? "aspect-[3/4]" : "aspect-[4/3]";
              return (
                <article
                  key={product.id}
                  className={`${panel} ${span} group flex flex-col transition hover:-translate-y-0.5`}
                >
                  <div
                    className={`relative ${aspect} overflow-hidden ${isDark ? "bg-white/[0.03]" : "bg-slate-100"}`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-cyan-500">
                        <Package size={40} />
                      </div>
                    )}
                    {idx === 0 && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur-md">
                        <Zap size={10} className="text-cyan-400" />
                        Just dropped
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="line-clamp-1 text-base font-semibold tracking-tight transition hover:text-cyan-500"
                      >
                        {product.name}
                      </Link>
                      <span className="shrink-0 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-500">
                        New
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">{price.usdLabel}</p>
                      <p className={`text-xs ${muted}`}>{price.kshLabel}</p>
                    </div>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
                    >
                      View details <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ SPLIT CTA ═══════════════ */}
        <section className="mt-24 grid gap-4 md:grid-cols-2">
          {/* Left: dark panel */}
          <div
            className={`relative overflow-hidden rounded-3xl p-8 ring-1 sm:p-10 ${
              isDark
                ? "bg-gradient-to-br from-cyan-500/20 via-slate-950 to-slate-950 ring-white/10"
                : "bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-950 ring-slate-800"
            }`}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />
            <div className="relative text-white">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-cyan-300 ring-1 ring-white/20 backdrop-blur">
                <TestTube size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Join the lab
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                Early access to drops, restocks, and lab notes. No spam — just
                science you can wear.
              </p>
              <Link
                to="/signup"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-50"
              >
                Create an account
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Right: light panel with trust */}
          <div
            className={`relative overflow-hidden rounded-3xl p-8 ring-1 sm:p-10 ${
              isDark
                ? "bg-white/[0.03] ring-white/10"
                : "bg-white ring-slate-200"
            }`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                color: isDark ? "#67e8f9" : "#0891b2",
              }}
            />
            <div className="relative">
              <h3 className="text-lg font-semibold tracking-tight">
                Why Novalorx
              </h3>
              <ul className={`mt-5 space-y-4 text-sm ${muted}`}>
                <li className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                    <Truck size={15} />
                  </span>
                  <div>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Free shipping over $75
                    </p>
                    <p>Global delivery in 5–10 days.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                    <Undo2 size={15} />
                  </span>
                  <div>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      30-day returns
                    </p>
                    <p>No questions asked. Lab-tested trust.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                    <ShieldCheck size={15} />
                  </span>
                  <div>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Secure checkout
                    </p>
                    <p>Encrypted payments. Your data stays yours.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
