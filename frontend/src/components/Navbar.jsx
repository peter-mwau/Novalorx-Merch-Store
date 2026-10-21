import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/themeContext";
import CartSidebar from "./cart/CartSidebar";
import { useCart } from "../contexts/CartContext.jsx";

function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, logout, isAdmin } = useAuth();
  const { showToast, dismissToast } = useToast();
  const { darkMode, toggleTheme } = useTheme();
  const isDark = darkMode;
  const [cartOpen, setCartOpen] = useState(false);
  const { count: cartCount } = useCart() || {};

  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    const toastId = showToast("Signing out...", "loading", 0);
    try {
      await logout();
      dismissToast(toastId);
      showToast("Signed out successfully.", "success");
      setProfileOpen(false);
    } catch (error) {
      dismissToast(toastId);
      showToast(error.message || "Unable to sign out.", "error");
    }
  };

  /* ─── Style tokens that mirror AuthModal exactly ─── */
  const navBase = isDark
    ? "bg-slate-950/70 ring-white/10 text-white"
    : "bg-white/75 ring-slate-200 text-slate-900";

  const linkBase = `relative text-sm font-medium tracking-tight transition-colors ${
    isDark
      ? "text-slate-300 hover:text-white"
      : "text-slate-600 hover:text-slate-900"
  }`;

  const iconBtn = `relative grid h-9 w-9 place-items-center rounded-full transition ${
    isDark
      ? "text-slate-400 hover:bg-white/[0.07] hover:text-white"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  }`;

  const ring = isDark ? "ring-white/10" : "ring-slate-200";
  const softSurface = isDark ? "bg-white/[0.04]" : "bg-slate-50";
  const divider = isDark ? "bg-white/10" : "bg-slate-200";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          className={`relative mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-visible rounded-3xl px-4 py-2.5 ring-1 backdrop-blur-xl transition-all duration-300 ${navBase} ${
            scrolled
              ? isDark
                ? "shadow-xl shadow-black/40"
                : "shadow-xl shadow-cyan-500/5"
              : "shadow-md shadow-slate-900/5"
          }`}
        >
          {/* ── Signature glow blobs (same as modal brand panel) ── */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

          {/* ── Subtle grid overlay (identical to modal) ── */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              color: isDark ? "#67e8f9" : "#0891b2",
            }}
          />

          {/* ── Logo (same gradient tile as modal) ── */}
          <a href="/" className="relative flex shrink-0 items-center gap-3">
            <img
              src="/Novalorx_mini_logo.png"
              alt="Novalorx Labs"
              className="h-10 w-10 shadow shadow-cyan-500/30 rounded-full object-cover p-1"
            />
            <span
              className={`hidden text-base font-semibold tracking-tight sm:block ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Novalorx Labs
            </span>
          </a>

          {/* ── Center links ── */}
          <ul className="relative hidden items-center gap-7 md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "About", href: "/about" },
              ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`group ${linkBase}`}>
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-cyan-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* ── Right cluster ── */}
          <div className="relative flex items-center gap-1">
            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              className={iconBtn}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className={iconBtn}
            >
              <Bell size={17} />
              <span
                className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ${
                  isDark ? "ring-slate-950" : "ring-white"
                }`}
              />
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label="Cart"
              className={`${iconBtn} hover:cursor-pointer`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <span
                className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ${
                  isDark ? "ring-slate-950" : "ring-white"
                }`}
              />
            </button>

            <span className={`mx-1.5 hidden h-5 w-px sm:block ${divider}`} />

            {/* Profile / Sign in */}
            {isLoggedIn ? (
              <div
                className="relative hidden items-center gap-1.5 md:flex"
                ref={profileRef}
              >
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-2 rounded-full p-1 pr-2.5 transition ring-1 ${ring} ${softSurface} ${
                    isDark ? "hover:bg-white/[0.07]" : "hover:bg-slate-100"
                  }`}
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
                      <User size={14} />
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    } ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  />
                </button>
                {profileOpen && (
                  <div
                    role="menu"
                    className={`absolute right-0 top-12 z-30 w-60 overflow-hidden rounded-2xl p-1.5 shadow-xl ring-1 backdrop-blur-xl ${
                      isDark
                        ? "bg-slate-950/90 ring-white/10"
                        : "bg-white/95 ring-slate-200"
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <p
                        className={`truncate text-sm font-semibold tracking-tight ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.fullName || "Account"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                    <div className={`my-1 h-px ${divider}`} />
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        isDark
                          ? "text-slate-300 hover:bg-white/5 hover:text-white"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <User size={15} /> My profile
                    </Link>
                    <a
                      href="/orders"
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        isDark
                          ? "text-slate-300 hover:bg-white/5 hover:text-white"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <ShoppingCart size={15} /> My orders
                    </a>
                    <div className={`my-1 h-px ${divider}`} />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 md:flex"
              >
                Sign in
              </button>
            )}

            {/* Mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={`${iconBtn} md:hidden`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile sheet (matching modal surface) */}
        {mobileOpen && (
          <div
            ref={mobileRef}
            className={`relative mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl p-3 shadow-xl ring-1 backdrop-blur-xl md:hidden ${
              isDark
                ? "bg-slate-950/90 ring-white/10"
                : "bg-white/95 ring-slate-200"
            }`}
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
            <ul className="relative flex flex-col gap-1">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About", href: "/about" },
                ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium tracking-tight transition ${
                      isDark
                        ? "text-slate-300 hover:bg-white/5 hover:text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className={`relative my-2 h-px ${divider}`} />

            {isLoggedIn ? (
              <div className="relative space-y-1">
                <div className="flex items-center gap-2 px-3 py-2">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
                      <User size={14} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold tracking-tight ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {user?.fullName || "Account"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <a
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                    isDark
                      ? "text-slate-300 hover:bg-white/5 hover:text-white"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <User size={16} /> My profile
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthOpen(true);
                }}
                className="relative w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </div>

      <div className="h-20" />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;
