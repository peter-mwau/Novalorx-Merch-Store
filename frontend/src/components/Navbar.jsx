import { useEffect, useRef, useState } from "react";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/themeContext";

function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { showToast, dismissToast } = useToast();
  const { darkMode, toggleTheme } = useTheme();
  const isDark = darkMode;

  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on Escape
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

  const linkBase = `relative text-sm font-medium transition-colors ${
    isDark
      ? "text-slate-300 hover:text-white"
      : "text-slate-600 hover:text-slate-900"
  }`;

  const iconBtn = `relative grid h-9 w-9 place-items-center rounded-full transition ${
    isDark
      ? "text-slate-300 hover:bg-white/10 hover:text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

  return (
    <>
      {/* Floating pill wrapper */}
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? "border-white/10 bg-slate-950/70 text-white"
              : "border-slate-200 bg-white/70 text-slate-900"
          } ${
            scrolled
              ? isDark
                ? "shadow-lg shadow-black/30"
                : "shadow-lg shadow-slate-900/5"
              : "shadow-sm"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/Novalorx Logo.svg"
              alt="Novalorx Labs"
              className="h-8 w-auto"
            />
          </a>

          {/* Center links (desktop) */}
          <ul className="hidden items-center gap-7 md:flex">
            <li>
              <a href="/" className={linkBase}>
                Home
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-cyan-500 transition-all duration-300 hover:w-full" />
              </a>
            </li>
            <li>
              <a href="/shop" className={linkBase}>
                Shop
              </a>
            </li>
            <li>
              <a href="/about" className={linkBase}>
                About
              </a>
            </li>
            <li>
              <a href="/contact" className={linkBase}>
                Contact
              </a>
            </li>
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
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
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-slate-950" />
            </button>

            {/* Cart */}
            <button type="button" aria-label="Cart" className={iconBtn}>
              <ShoppingCart size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-slate-950" />
            </button>

            <span
              className={`mx-1 hidden h-5 w-px sm:block ${
                isDark ? "bg-white/10" : "bg-slate-200"
              }`}
            />

            {/* Auth / Profile (desktop) */}
            {isLoggedIn ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-2 rounded-full p-1 pr-2 transition ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-500 text-white">
                      <User size={14} />
                    </span>
                  )}
                  {profileOpen ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className={`absolute right-0 top-12 z-30 w-60 overflow-hidden rounded-2xl p-1.5 shadow-xl ring-1 ${
                      isDark
                        ? "bg-slate-900 ring-white/10"
                        : "bg-white ring-slate-200"
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.fullName || "Account"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                    <div
                      className={`my-1 h-px ${
                        isDark ? "bg-white/10" : "bg-slate-100"
                      }`}
                    />
                    <a
                      href="/account"
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        isDark
                          ? "text-slate-300 hover:bg-white/5 hover:text-white"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <User size={15} /> My account
                    </a>
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
                    <div
                      className={`my-1 h-px ${
                        isDark ? "bg-white/10" : "bg-slate-100"
                      }`}
                    />
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

            {/* Mobile menu button */}
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

        {/* Mobile sheet */}
        {mobileOpen && (
          <div
            ref={mobileRef}
            className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border p-3 shadow-xl backdrop-blur-xl md:hidden ${
              isDark
                ? "border-white/10 bg-slate-950/90"
                : "border-slate-200 bg-white/90"
            }`}
          >
            <ul className="flex flex-col gap-1">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
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

            <div
              className={`my-2 h-px ${isDark ? "bg-white/10" : "bg-slate-100"}`}
            />

            {isLoggedIn ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-500 text-white">
                      <User size={14} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold ${
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
                className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </div>

      {/* Spacer so content doesn't hide under the floating navbar */}
      <div className="h-20" />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Navbar;
