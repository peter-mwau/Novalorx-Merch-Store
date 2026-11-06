import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Compass,
  FlaskConical,
  Heart,
  Lightbulb,
  Microscope,
  Sparkles,
  Target,
  TestTube,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "../contexts/themeContext.jsx";

const STATS = [
  { value: "2021", label: "Founded in Nairobi" },
  { value: "40k+", label: "Curious customers" },
  { value: "18", label: "Countries shipped" },
  { value: "4.8", label: "Average rating" },
];

const VALUES = [
  {
    icon: Microscope,
    title: "Tested, not guessed",
    body: "Every product goes through a real prototype round before it ships. If it doesn't survive the lab, it doesn't reach your doorstep.",
  },
  {
    icon: Heart,
    title: "Built to be used",
    body: "We design for daily wear, not for the shelf. Materials that age well, inks that don't crack, pages that don't bleed.",
  },
  {
    icon: Lightbulb,
    title: "Curiosity as a habit",
    body: "We make things for people who ask questions. The notebook you sketch in, the tee you wear while you think — everything earns its place.",
  },
  {
    icon: Users,
    title: "Small team, long memory",
    body: "We're a studio, not a factory. Every drop is designed by people you can reach, and every email gets a real reply.",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "A notebook and a problem",
    body: "Novalorx started as a side project: a chemist, a designer, and a garage full of half-finished notebooks. The problem was simple — good lab gear never looked good, and good-looking gear never held up.",
  },
  {
    year: "2022",
    title: "First drop · Vol. 01",
    body: "Forty tees, fifty notebooks, sold out in a week. We didn't have a store yet — just a form, a spreadsheet, and a lot of envelopes.",
  },
  {
    year: "2023",
    title: "The lab gets a roof",
    body: "We opened our first real studio in Nairobi. Bought a screen printer that mostly worked, hired our second employee, and started shipping outside Kenya.",
  },
  {
    year: "2024",
    title: "Merch becomes a language",
    body: "Pens, bookmarks, diaries — the catalog grew into a full kit for curious minds. Still small batches, still lab-tested, still shipped by people who care.",
  },
  {
    year: "Today",
    title: "Vol. 04 and counting",
    body: "Forty thousand customers, eighteen countries, the same garage discipline. We still prototype every product, and we still reply to every email.",
  },
];

export default function About() {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const muted = isDark ? "text-slate-400" : "text-slate-500";

  const panel = `relative overflow-hidden rounded-3xl ring-1 backdrop-blur-xl ${
    isDark
      ? "bg-slate-950/70 ring-white/10 text-white"
      : "bg-white/80 ring-slate-200 text-slate-900"
  } shadow-lg ${isDark ? "shadow-black/30" : "shadow-slate-900/5"}`;

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-x-clip pb-16">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-[80rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pt-28">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
                  : "bg-cyan-500/10 text-cyan-600 ring-cyan-500/30"
              }`}
            >
              <Sparkles size={12} /> Our story · Vol. 04
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl">
              A lab that
              <br />
              makes{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                  things.
                </span>
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

            <p className={`mt-8 max-w-lg text-base leading-relaxed ${muted}`}>
              Novalorx Labs is a small studio in Nairobi making gear for people
              who ask too many questions. Apparel, notebooks, pens — the kit you
              reach for when your brain won't sit still.
            </p>

            <p className={`mt-4 max-w-lg text-base leading-relaxed ${muted}`}>
              We started with a simple frustration: lab gear never looked good,
              and good-looking gear never held up. We decided to stop choosing.
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
                to="/contact"
                className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ring-1 transition ${
                  isDark
                    ? "text-slate-200 ring-white/10 hover:bg-white/5"
                    : "text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                Get in touch
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Manifesto card */}
          <div className="relative lg:col-span-5">
            <div className="absolute -right-4 -top-4 h-24 w-24 rotate-6 rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/20" />
            <div className={`${panel} p-8 lg:-mt-8`}>
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  color: isDark ? "#67e8f9" : "#0891b2",
                }}
              />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                  <FlaskConical size={22} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                  The manifesto
                </p>
                <blockquote className="mt-3 text-xl font-medium leading-snug tracking-tight">
                  "Good gear should survive the lab and the commute. Anything
                  less is just merch."
                </blockquote>
                <p className={`mt-4 text-xs ${muted}`}>
                  — The Novalorx founding note, 2021
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <section className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className={`relative overflow-hidden rounded-2xl p-5 ring-1 ${
                isDark
                  ? "bg-white/[0.03] ring-white/10"
                  : "bg-white ring-slate-200"
              }`}
            >
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {value}
              </p>
              <p className={`mt-1 text-xs ${muted}`}>{label}</p>
            </div>
          ))}
        </section>

        {/* ═══════════════ VALUES (bento) ═══════════════ */}
        <section className="mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              What we believe
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              Four rules we don't break
            </h2>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
              We're not trying to make everything. We're trying to make a few
              things well, and to keep making them well for a long time.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }, idx) => {
              const featured = idx === 0;
              return (
                <div
                  key={title}
                  className={`relative overflow-hidden rounded-3xl p-7 ring-1 transition ${
                    featured
                      ? isDark
                        ? "bg-gradient-to-br from-cyan-500/15 via-white/[0.03] to-white/[0.03] ring-white/10"
                        : "bg-gradient-to-br from-cyan-500/10 via-white to-slate-50 ring-slate-200"
                      : isDark
                        ? "bg-white/[0.03] ring-white/10"
                        : "bg-white ring-slate-200"
                  } ${featured ? "md:col-span-2" : ""}`}
                >
                  {featured && (
                    <div className="pointer-events-none absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
                  )}
                  <div className="relative">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-xl ${
                        featured
                          ? "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                          : "bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3
                      className={`mt-5 font-semibold tracking-tight ${
                        featured ? "text-xl" : "text-lg"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${muted} ${
                        featured ? "max-w-2xl" : ""
                      }`}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ TIMELINE ═══════════════ */}
        <section className="mt-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              The long version
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              How we got here
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className={`absolute left-3 top-2 bottom-2 w-px sm:left-4 ${
                isDark ? "bg-white/10" : "bg-slate-200"
              }`}
            />

            <div className="space-y-6">
              {TIMELINE.map(({ year, title, body }) => (
                <div key={year} className="relative flex gap-5 pl-0">
                  {/* Node */}
                  <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 ring-4 ring-white dark:ring-slate-950 sm:h-9 sm:w-9">
                    <Zap size={12} />
                  </div>

                  <div className="min-w-0 flex-1 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                      {year}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p
                      className={`mt-1 max-w-2xl text-sm leading-relaxed ${muted}`}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ SPLIT CTA ═══════════════ */}
        <section className="mt-24 grid gap-4 md:grid-cols-2">
          {/* Dark panel — "Meet the lab" */}
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
                <Beaker size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Meet the lab
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                A chemist, a designer, and a small team of stubborn people who
                still prototype everything by hand.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-50"
              >
                Say hello
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Light panel — "What's next" */}
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
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                <Compass size={20} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                What's next
              </h3>
              <ul className={`mt-4 space-y-3 text-sm ${muted}`}>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                  Vol. 05 drops in early 2025 — a rework of the notebook line.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                  A small run of lab-grade pen refills.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                  Expanding shipping to 6 more countries.
                </li>
              </ul>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-500 transition hover:text-cyan-400"
              >
                Shop the current drop
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ CLOSING LINE ═══════════════ */}
        <section className="mt-24 text-center">
          <p
            className={`mx-auto max-w-xl text-xs font-medium uppercase tracking-[0.2em] ${muted}`}
          >
            Novalorx Labs · Nairobi · Est. 2021
          </p>
          <p className="mt-3 text-sm tracking-tight">
            <span className="text-cyan-500">Still curious?</span> That's the
            whole point.
          </p>
        </section>
      </div>
    </main>
  );
}
