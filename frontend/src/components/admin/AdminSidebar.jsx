import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlignCenterVertical,
  FolderUsers,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Proportions,
  UserStar,
} from "lucide-react";
import { useTheme } from "../../contexts/themeContext.jsx";

const LINKS = [
  { name: "Admin Dashboard", icon: UserStar, path: "/admin/dashboard" },
  { name: "Manage Users", icon: FolderUsers, path: "/admin/manage-users" },
  {
    name: "Manage Items",
    icon: AlignCenterVertical,
    path: "/admin/manage-items",
  },
  { name: "Report", icon: Proportions, path: "/admin/report" },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminSidebar() {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  /* ─── Style tokens (mirror AuthModal / Navbar / Profile / Cart) ─── */
  const asideBase = isDark
    ? "bg-slate-950/85 ring-white/10 text-white"
    : "bg-white/90 ring-slate-200 text-slate-900";

  const muted = isDark ? "text-slate-400" : "text-slate-500";

  const divider = isDark ? "bg-white/10" : "bg-slate-200";

  const iconBtn = `grid h-8 w-8 place-items-center rounded-xl ring-1 transition ${
    isDark
      ? "bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white"
      : "bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100 hover:text-slate-900"
  }`;

  return (
    <aside
      className={`relative flex shrink-0 flex-col overflow-hidden rounded-tr-3xl ring-1 backdrop-blur-xl transition-[width] duration-300 ease-out ${asideBase} ${
        collapsed ? "w-[76px]" : "w-full md:w-60"
      } min-h-[calc(100vh-5rem)] shadow-xl ${
        isDark ? "shadow-black/30" : "shadow-slate-900/5"
      }`}
      aria-label="Admin navigation"
    >
      {/* Signature glow blobs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

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

      {/* Header: brand + collapse toggle */}
      <div className="relative flex items-center gap-2 px-3 py-4">
        {!collapsed && (
          <img
            src="/Novalorx_mini_logo.png"
            alt="Novalorx Labs"
            className="h-10 w-10 shadow shadow-cyan-500/30 rounded-full object-cover p-1"
          />
        )}

        <div
          className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ${
            collapsed
              ? "pointer-events-none w-0 opacity-0"
              : "w-auto opacity-100"
          }`}
        >
          <span className="truncate text-sm font-semibold tracking-tight">
            Novalorx
          </span>
          <span className={`truncate text-[11px] ${muted}`}>Admin panel</span>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-controls="admin-sidebar-nav"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`${iconBtn} ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>

      <div className={`relative mx-3 h-px ${divider}`} />

      {/* Nav */}
      <nav
        id="admin-sidebar-nav"
        className="relative flex-1 overflow-y-auto px-2 py-3"
      >
        <ul className="space-y-1">
          {LINKS.map(({ name, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                title={collapsed ? name : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl text-sm transition ${
                    collapsed
                      ? "justify-center px-0 py-2.5"
                      : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-cyan-500 font-semibold text-white shadow-lg shadow-cyan-500/25"
                      : isDark
                        ? "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition ${
                        isActive
                          ? "text-white"
                          : isDark
                            ? "text-slate-400 group-hover:text-cyan-300"
                            : "text-slate-500 group-hover:text-cyan-600"
                      }`}
                    />

                    <span
                      className={`truncate tracking-tight transition-all duration-300 ${
                        collapsed
                          ? "pointer-events-none w-0 opacity-0"
                          : "w-auto opacity-100"
                      }`}
                    >
                      {name}
                    </span>

                    {/* Active left bar (expanded only) */}
                    {isActive && !collapsed && (
                      <span className="pointer-events-none absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-white/70" />
                    )}

                    {/* Custom tooltip when collapsed */}
                    {collapsed && (
                      <span
                        role="tooltip"
                        className={`pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-lg ring-1 transition-opacity group-hover:opacity-100 group-hover:md:block ${
                          isDark
                            ? "bg-slate-900 text-white ring-white/10"
                            : "bg-slate-900 text-white ring-slate-800"
                        }`}
                      >
                        {name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`relative mx-3 h-px ${divider}`} />

      <div className="relative p-2 pb-4">
        <NavLink
          to="/"
          title={collapsed ? "Back to store" : undefined}
          className={({ isActive }) =>
            `group relative flex items-center rounded-xl text-sm transition ${
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
            } ${
              isActive
                ? "bg-cyan-500 font-semibold text-white"
                : isDark
                  ? "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          <Home
            size={18}
            className={`shrink-0 ${
              isDark
                ? "text-slate-400 group-hover:text-cyan-300"
                : "text-slate-500 group-hover:text-cyan-600"
            }`}
          />
          <span
            className={`truncate tracking-tight transition-all duration-300 ${
              collapsed
                ? "pointer-events-none w-0 opacity-0"
                : "w-auto opacity-100"
            }`}
          >
            Back to store
          </span>

          {collapsed && (
            <span
              role="tooltip"
              className={`pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-lg ring-1 transition-opacity group-hover:opacity-100 group-hover:md:block ${
                isDark
                  ? "bg-slate-900 text-white ring-white/10"
                  : "bg-slate-900 text-white ring-slate-800"
              }`}
            >
              Back to store
            </span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
