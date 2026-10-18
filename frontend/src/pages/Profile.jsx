import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  UserCog,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";

function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
}

export default function Profile() {
  const { user, isLoggedIn, loading, updateProfile, changePassword } =
    useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [details, setDetails] = useState({ fullName: "", phone: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate("/");
  }, [isLoggedIn, loading, navigate]);

  useEffect(() => {
    if (user)
      setDetails({ fullName: user.fullName || "", phone: user.phone || "" });
  }, [user]);

  const stats = useMemo(
    () => [
      {
        icon: <UserCog size={16} />,
        label: "Role",
        value: user?.role || "—",
      },
      {
        icon: <ShieldCheck size={16} />,
        label: "Auth",
        value: user?.authProvider === "CLERK" ? "Clerk" : "Email",
      },
      {
        icon: <CalendarDays size={16} />,
        label: "Member since",
        value: formatDate(user?.createdAt),
      },
      {
        icon: <KeyRound size={16} />,
        label: "Last sign in",
        value: formatDate(user?.lastLogin),
      },
    ],
    [user],
  );

  if (loading || !user) return null;

  const isDark = darkMode;

  /* ─── Style tokens (mirror AuthModal + Navbar) ─── */
  const card = `relative overflow-hidden rounded-3xl p-6 ring-1 backdrop-blur-xl transition ${
    isDark ? "bg-slate-950/70 ring-white/10" : "bg-white/80 ring-slate-200"
  } shadow-lg ${isDark ? "shadow-black/30" : "shadow-slate-900/5"}`;

  const label = `mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  const input = `w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 transition ${
    isDark
      ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500 focus:ring-cyan-400/70"
      : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-cyan-500"
  }`;

  const primaryBtn = `inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50`;

  const secondaryBtn = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-cyan-500 ring-1 ring-cyan-500/40 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50`;

  const divider = isDark ? "bg-white/10" : "bg-slate-200";

  const saveDetails = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(details);
      setMessage({ type: "success", text: "Profile details updated." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage({ type: "success", text: "Password updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      className={`relative min-h-[calc(100vh-5rem)] px-4 py-10 ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Signature glow blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-500 transition hover:text-cyan-400"
          >
            <ArrowLeft size={15} /> Back to store
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                My profile
              </h1>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Manage your Novalorx Labs account details.
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30"
                  : "bg-cyan-500/10 text-cyan-600 ring-cyan-500/30"
              }`}
            >
              <Sparkles size={12} /> {user.role}
            </span>
          </div>
        </div>

        {/* Inline message */}
        {message && (
          <div
            className={`mb-6 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ring-1 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
                : "bg-red-500/10 text-red-500 ring-red-500/20"
            }`}
          >
            {message.type === "success" && (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ─── Identity card ─── */}
          <section className={card}>
            {/* Grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                color: isDark ? "#67e8f9" : "#0891b2",
              }}
            />
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative flex items-center gap-4">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-cyan-500/20"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20">
                  <User size={30} />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight">
                  {user.fullName || "Account"}
                </h2>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className={`relative my-6 h-px ${divider}`} />

            <dl className="relative grid grid-cols-2 gap-4 text-sm">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl p-3 ring-1 ${
                    isDark
                      ? "bg-white/[0.03] ring-white/5"
                      : "bg-slate-50 ring-slate-100"
                  }`}
                >
                  <dt
                    className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {s.icon}
                    {s.label}
                  </dt>
                  <dd className="mt-1.5 truncate font-semibold tracking-tight">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ─── Forms column ─── */}
          <div className="space-y-6">
            {/* Personal details */}
            <section className={card}>
              <div className="relative">
                <h2 className="text-lg font-semibold tracking-tight">
                  Personal details
                </h2>
                <p
                  className={`mt-0.5 text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Update how we reach you.
                </p>
              </div>

              <form onSubmit={saveDetails} className="relative mt-5 space-y-4">
                <label className="block">
                  <span className={label}>
                    <User size={13} /> Full name
                  </span>
                  <input
                    className={input}
                    value={details.fullName}
                    onChange={(e) =>
                      setDetails({ ...details, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                  />
                </label>

                <label className="block">
                  <span className={label}>
                    <Phone size={13} /> Phone
                  </span>
                  <input
                    className={input}
                    value={details.phone}
                    onChange={(e) =>
                      setDetails({ ...details, phone: e.target.value })
                    }
                    placeholder="+1 555 000 0000"
                  />
                </label>

                <label className="block">
                  <span className={label}>
                    <Mail size={13} /> Email
                  </span>
                  <input
                    className={`${input} cursor-not-allowed opacity-60`}
                    value={user.email}
                    readOnly
                  />
                </label>

                <div className="flex justify-end pt-1">
                  <button disabled={saving} className={primaryBtn}>
                    {saving ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    Save details
                  </button>
                </div>
              </form>
            </section>

            {/* Password */}
            <section className={card}>
              <div className="relative">
                <h2 className="text-lg font-semibold tracking-tight">
                  Password
                </h2>
                <p
                  className={`mt-0.5 text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Keep your account secure.
                </p>
              </div>

              {user.authProvider === "CLERK" ? (
                <div
                  className={`relative mt-5 flex items-start gap-3 rounded-2xl p-4 ring-1 ${
                    isDark
                      ? "bg-white/[0.03] ring-white/5"
                      : "bg-slate-50 ring-slate-100"
                  }`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20">
                    <ShieldCheck size={16} />
                  </span>
                  <p className="text-sm text-slate-500">
                    Your password is managed by Clerk. Update it from your Clerk
                    account settings.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={savePassword}
                  className="relative mt-5 space-y-4"
                >
                  <label className="block">
                    <span className={label}>
                      <Lock size={13} /> Current password
                    </span>
                    <div className="relative">
                      <input
                        required
                        type={showCurrent ? "text" : "password"}
                        className={`${input} pr-10`}
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((s) => !s)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                          isDark
                            ? "text-slate-500 hover:text-white"
                            : "text-slate-400 hover:text-slate-900"
                        }`}
                        aria-label="Toggle password"
                      >
                        {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className={label}>
                      <Lock size={13} /> New password
                    </span>
                    <div className="relative">
                      <input
                        required
                        minLength={8}
                        type={showNew ? "text" : "password"}
                        className={`${input} pr-10`}
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                          isDark
                            ? "text-slate-500 hover:text-white"
                            : "text-slate-400 hover:text-slate-900"
                        }`}
                        aria-label="Toggle password"
                      >
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <div className="flex justify-end pt-1">
                    <button disabled={saving} className={secondaryBtn}>
                      {saving ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <KeyRound size={15} />
                      )}
                      Update password
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
