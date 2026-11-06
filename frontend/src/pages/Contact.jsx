import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../contexts/themeContext.jsx";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@novalorx.com",
    href: "mailto:hello@novalorx.com",
    note: "Best for orders, returns, and anything that needs a paper trail.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+254 700 000 000",
    href: "tel:+254700000000",
    note: "Mon–Fri, 9am–5pm EAT. If we miss you, we call back same day.",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Nairobi, Kenya",
    href: "https://maps.google.com/?q=Nairobi",
    note: "Visits by appointment — drop us a line first so we're actually in.",
  },
];

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Orders ship within 2 business days. Kenya delivery is 1–3 days; international is 5–10 days depending on the destination. You'll get a tracking link the moment it leaves the studio.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes — 30 days from delivery, unworn and in original packaging. Email us with your order number and we'll send a return label. Refunds land within 5 business days of the item arriving back.",
  },
  {
    q: "Do you ship outside Kenya?",
    a: "We currently ship to 18 countries across Africa, Europe, and North America. If yours isn't on the list, email us — we add new countries every quarter based on demand.",
  },
  {
    q: "Can I request a custom or bulk order?",
    a: "For orders over 25 units, yes. We do custom prints on tees and hoodies, and custom notebook covers. Email hello@novalorx.com with quantities and your deadline and we'll quote within 48 hours.",
  },
  {
    q: "Something arrived damaged. What now?",
    a: "Send a photo of the item and the packaging within 7 days of delivery. We replace damaged items at no cost — no return needed for anything under $50.",
  },
];

export default function Contact() {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const muted = isDark ? "text-slate-400" : "text-slate-500";

  const panel = `relative overflow-hidden rounded-3xl ring-1 backdrop-blur-xl ${
    isDark
      ? "bg-slate-950/70 ring-white/10 text-white"
      : "bg-white/80 ring-slate-200 text-slate-900"
  } shadow-lg ${isDark ? "shadow-black/30" : "shadow-slate-900/5"}`;

  const inputBase = `w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 transition ${
    isDark
      ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500 focus:ring-cyan-400/70"
      : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-cyan-500"
  }`;

  const labelCls = `mb-1.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Message could not be sent. Try again.");
      }
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-x-clip pb-16">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pt-28">
        {/* ═══════════════ HERO + FORM SPLIT ═══════════════ */}
        <section className="grid items-start gap-10 lg:grid-cols-12">
          {/* Left: intro + channels */}
          <div className="lg:col-span-5">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
                  : "bg-cyan-500/10 text-cyan-600 ring-cyan-500/30"
              }`}
            >
              <Sparkles size={12} /> Replies within 1 business day
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tighter sm:text-5xl">
              Say hello
              <br />
              to the{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                lab.
              </span>
            </h1>

            <p className={`mt-5 max-w-md text-base leading-relaxed ${muted}`}>
              Orders, returns, custom prints, or just a question you can't
              Google — we read everything and reply to all of it.
            </p>

            <div className="mt-8 space-y-3">
              {CHANNELS.map(({ icon: Icon, label, value, href, note }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl p-4 ring-1 transition hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]"
                      : "bg-white ring-slate-200 hover:shadow-lg hover:shadow-slate-900/5"
                  }`}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20 transition group-hover:bg-cyan-500 group-hover:text-white">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[11px] font-medium uppercase tracking-wider ${muted}`}
                    >
                      {label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold tracking-tight">
                      {value}
                    </p>
                    <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
                      {note}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className={`shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                      isDark
                        ? "text-slate-500 group-hover:text-cyan-400"
                        : "text-slate-400 group-hover:text-cyan-500"
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <div className={`${panel} p-6 sm:p-8`}>
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  color: isDark ? "#67e8f9" : "#0891b2",
                }}
              />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Send a message
                    </h2>
                    <p className={`text-xs ${muted}`}>
                      Fields marked with * are required.
                    </p>
                  </div>
                </div>

                {sent ? (
                  <SuccessState
                    isDark={isDark}
                    onReset={() => setSent(false)}
                  />
                ) : (
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className={labelCls}>Your name *</span>
                        <input
                          required
                          className={inputBase}
                          value={form.name}
                          onChange={update("name")}
                          placeholder="Jane Doe"
                        />
                      </label>
                      <label className="block">
                        <span className={labelCls}>Email *</span>
                        <input
                          required
                          type="email"
                          className={inputBase}
                          value={form.email}
                          onChange={update("email")}
                          placeholder="you@lab.com"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className={labelCls}>Subject</span>
                      <input
                        className={inputBase}
                        value={form.subject}
                        onChange={update("subject")}
                        placeholder="Order #1234, custom print, general question..."
                      />
                    </label>

                    <label className="block">
                      <span className={labelCls}>Message *</span>
                      <textarea
                        required
                        rows={6}
                        className={`${inputBase} resize-none`}
                        value={form.message}
                        onChange={update("message")}
                        placeholder="Tell us what's up. The more detail, the faster we can help."
                      />
                    </label>

                    {error && (
                      <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500 ring-1 ring-red-500/20">
                        {error}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className={`text-xs ${muted}`}>
                        By sending, you agree to our{" "}
                        <Link
                          to="/privacy"
                          className="text-cyan-500 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {sending ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Sending...
                          </>
                        ) : (
                          <>
                            Send message <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section className="mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Before you write
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              Answers to the usual
            </h2>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
              If your question isn't here, the form above is the fastest way to
              reach a human.
            </p>
          </div>

          <div className="grid gap-3">
            {FAQS.map(({ q, a }, idx) => {
              const open = openFaq === idx;
              return (
                <div
                  key={q}
                  className={`overflow-hidden rounded-2xl ring-1 transition ${
                    isDark
                      ? "bg-white/[0.03] ring-white/10"
                      : "bg-white ring-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold tracking-tight">
                      {q}
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                        open
                          ? "bg-cyan-500 text-white"
                          : isDark
                            ? "bg-white/5 text-slate-400"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span className="text-sm leading-none">
                        {open ? "−" : "+"}
                      </span>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`border-t px-5 py-4 text-sm leading-relaxed ${muted} ${
                          isDark ? "border-white/10" : "border-slate-100"
                        }`}
                      >
                        {a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ SPLIT CTA ═══════════════ */}
        <section className="mt-24 grid gap-4 md:grid-cols-2">
          {/* Dark panel */}
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
                <Clock size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Need it faster?
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                Orders over $75 ship free, and we send tracking the same day. If
                it's urgent, put "urgent" in the subject line — we triage those
                first.
              </p>
              <Link
                to="/shop"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-50"
              >
                Shop the collection
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Light panel */}
          <div
            className={`relative overflow-hidden rounded-3xl p-8 ring-1 sm:p-10 ${
              isDark
                ? "bg-white/[0.03] ring-white/10"
                : "bg-white ring-slate-200"
            }`}
          >
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                <Mail size={20} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                Prefer email?
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                Some conversations just belong in an inbox. Reach us directly —
                no form, no tracking, no middleman.
              </p>
              <a
                href="mailto:hello@novalorx.com"
                className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              >
                hello@novalorx.com
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <p className={`mt-4 text-[11px] ${muted}`}>
                Replies within 1 business day · Mon–Fri, 9am–5pm EAT
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ CLOSING LINE ═══════════════ */}
        <section className="mt-24 text-center">
          <p
            className={`mx-auto max-w-xl text-xs font-medium uppercase tracking-[0.2em] ${muted}`}
          >
            Novalorx Labs · Nairobi · Hello@novalorx.com
          </p>
          <p className="mt-3 text-sm tracking-tight">
            <span className="text-cyan-500">Still curious?</span> We like that.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ─── Success state ─── */
function SuccessState({ isDark, onReset }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl p-10 text-center ring-1 ring-emerald-500/20 bg-emerald-500/5">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <CheckCircle2 size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        Message sent
      </h3>
      <p
        className={`mt-1 max-w-sm text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        Thanks for reaching out. We'll reply within one business day — usually
        sooner.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
      >
        Send another
      </button>
    </div>
  );
}
