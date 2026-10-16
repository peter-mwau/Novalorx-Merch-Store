import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../contexts/themeContext.jsx";
import ClerkButtons from "./ClerkButtons";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function AuthModal({ open, onClose, initialMode = "login" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      newPassword: "",
    });
    setError(null);
    setSuccess(null);
  };

  const switchMode = (m) => {
    setMode(m);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? `${API_URL}/auth/login`
          : mode === "signup"
            ? `${API_URL}/auth/register`
            : `${API_URL}/auth/reset-password`;

      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : mode === "signup"
            ? {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
              }
            : { email: form.email, newPassword: form.newPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      if (mode === "login") {
        if (data.token) localStorage.setItem("token", data.token);
        setSuccess("Welcome back!");
        setTimeout(() => {
          onClose();
          reset();
        }, 700);
      } else if (mode === "signup") {
        setSuccess("Account created. You can sign in now.");
        setTimeout(() => switchMode("login"), 900);
      } else {
        setSuccess("Password reset successful.");
        setTimeout(() => switchMode("login"), 900);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 backdrop-blur-sm ${
              isDark ? "bg-black/70" : "bg-slate-900/40"
            }`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl ring-1 md:grid-cols-2 ${
              isDark ? "bg-slate-950 ring-white/10" : "bg-white ring-slate-200"
            }`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className={`absolute right-4 top-4 z-20 rounded-full p-2 transition ${
                isDark
                  ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <X size={18} />
            </button>

            {/* Left: Brand panel */}
            <BrandPanel isDark={isDark} />

            {/* Right: Form panel */}
            <div className="relative flex flex-col justify-center p-8 sm:p-12">
              {mode !== "forgot" && (
                <div
                  className={`mb-8 inline-flex rounded-full p-1 text-sm font-medium ${
                    isDark ? "bg-white/5" : "bg-slate-100"
                  }`}
                >
                  {["login", "signup"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className={`relative flex-1 rounded-full px-5 py-2 transition ${
                        mode === m
                          ? "bg-cyan-500 text-white shadow"
                          : isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {m === "login" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className={`text-2xl font-semibold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {mode === "login" && "Welcome back"}
                    {mode === "signup" && "Create your account"}
                    {mode === "forgot" && "Reset your password"}
                  </h2>
                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {mode === "login" &&
                      "Sign in to your Novalorx Labs account."}
                    {mode === "signup" &&
                      "Join Novalorx Labs and start shopping."}
                    {mode === "forgot" &&
                      "Enter your email and a new password."}
                  </p>

                  {mode !== "forgot" && <ClerkButtons isDark={isDark} />}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {mode === "signup" && (
                      <>
                        <Field
                          icon={<UserIcon size={16} />}
                          placeholder="Full name"
                          value={form.fullName}
                          onChange={update("fullName")}
                          isDark={isDark}
                          autoComplete="name"
                        />
                        <Field
                          icon={<Phone size={16} />}
                          placeholder="Phone (optional)"
                          value={form.phone}
                          onChange={update("phone")}
                          isDark={isDark}
                          autoComplete="tel"
                        />
                      </>
                    )}

                    <Field
                      icon={<Mail size={16} />}
                      placeholder="Email address"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      isDark={isDark}
                      autoComplete="email"
                      required
                    />

                    {mode !== "forgot" && (
                      <Field
                        icon={<Lock size={16} />}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={update("password")}
                        isDark={isDark}
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        required
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className={`transition ${
                              isDark
                                ? "text-slate-400 hover:text-white"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                            aria-label="Toggle password"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        }
                      />
                    )}

                    {mode === "forgot" && (
                      <Field
                        icon={<Lock size={16} />}
                        placeholder="New password"
                        type={showPassword ? "text" : "password"}
                        value={form.newPassword}
                        onChange={update("newPassword")}
                        isDark={isDark}
                        autoComplete="new-password"
                        required
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className={`transition ${
                              isDark
                                ? "text-slate-400 hover:text-white"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        }
                      />
                    )}

                    {mode === "login" && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs font-medium text-cyan-500 hover:text-cyan-400"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500"
                      >
                        {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500"
                      >
                        {success}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          {mode === "login" && "Sign in"}
                          {mode === "signup" && "Create account"}
                          {mode === "forgot" && "Reset password"}
                          <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-0.5"
                          />
                        </>
                      )}
                    </button>

                    {mode === "forgot" && (
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className={`w-full text-center text-xs font-medium ${
                          isDark
                            ? "text-slate-400 hover:text-white"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        ← Back to sign in
                      </button>
                    )}
                  </form>

                  {mode === "signup" && (
                    <p
                      className={`mt-6 text-center text-[11px] leading-relaxed ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      By continuing you agree to our{" "}
                      <a
                        className="text-cyan-500 hover:underline"
                        href="/terms"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        className="text-cyan-500 hover:underline"
                        href="/privacy"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ─── Left brand panel ─── */
function BrandPanel({ isDark }) {
  return (
    <div
      className={`relative hidden overflow-hidden p-10 md:flex md:flex-col md:justify-between ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          color: isDark ? "#67e8f9" : "#0891b2",
        }}
      />

      <div className="relative flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
          <span className="text-sm font-bold">N</span>
        </div>
        <span
          className={`text-lg font-semibold tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Novalorx Labs
        </span>
      </div>

      <div className="relative">
        <h3
          className={`text-3xl font-semibold leading-tight tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Science you can
          <br />
          <span className="text-cyan-500">wear.</span>
        </h3>
        <p
          className={`mt-4 max-w-xs text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Lab-tested apparel, notebooks, and accessories for curious minds. Join
          the Novalorx community.
        </p>
      </div>

      <div
        className={`relative flex items-center gap-2 text-[11px] ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        Secure sign-in · Encrypted · JWT
      </div>
    </div>
  );
}

/* ─── Reusable input field ─── */
function Field({ icon, trailing, isDark, ...props }) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
        isDark
          ? "border-white/10 bg-white/5 focus-within:border-cyan-500/60 focus-within:bg-white/[0.07]"
          : "border-slate-200 bg-slate-50 focus-within:border-cyan-500 focus-within:bg-white"
      }`}
    >
      <span
        className={`shrink-0 ${
          isDark
            ? "text-slate-500 group-focus-within:text-cyan-400"
            : "text-slate-400 group-focus-within:text-cyan-500"
        }`}
      >
        {icon}
      </span>
      <input
        {...props}
        className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      />
      {trailing}
    </div>
  );
}
