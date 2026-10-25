import { useEffect, useMemo, useState } from "react";
import { Activity, ShieldCheck, UserCheck, Users } from "lucide-react";
import { useAdmin } from "../../contexts/adminContext.jsx";
import { useTheme } from "../../contexts/themeContext.jsx";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Never";

function AdminDashboard() {
  const { users, getAllUsers } = useAdmin();
  const { darkMode } = useTheme();
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers().catch(() => setError("Unable to load dashboard users."));
  }, [getAllUsers]);

  const stats = useMemo(() => {
    const managedUsers = users.filter((user) => user.role !== "ADMIN");
    return [
      { label: "Total users", value: managedUsers.length, icon: Users },
      {
        label: "Active users",
        value: managedUsers.filter((user) => user.isActive).length,
        icon: UserCheck,
      },
      {
        label: "Staff members",
        value: managedUsers.filter((user) => user.role === "STAFF").length,
        icon: ShieldCheck,
      },
      {
        label: "Recently active",
        value: managedUsers.filter(
          (user) =>
            user.lastLogin &&
            Date.now() - new Date(user.lastLogin).getTime() <
              7 * 24 * 60 * 60 * 1000,
        ).length,
        icon: Activity,
      },
    ];
  }, [users]);

  const recentUsers = [...users]
    .filter((user) => user.role !== "ADMIN")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const panel = darkMode
    ? "bg-slate-950/80 text-white ring-white/10"
    : "bg-white text-slate-900 ring-slate-200";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className={`mt-2 ${muted}`}>
          Monitor your community and keep user access up to date.
        </p>
      </header>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`rounded-2xl p-5 ring-1 ${panel}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${muted}`}>{label}</span>
              <Icon className="text-cyan-500" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className={`rounded-2xl p-5 ring-1 ${panel}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recently registered users</h2>
            <p className={`mt-1 text-sm ${muted}`}>Admin accounts are excluded.</p>
          </div>
          <Users className="text-cyan-500" size={22} />
        </div>
        <div className="mt-5 divide-y divide-slate-200/10">
          {recentUsers.length === 0 ? (
            <p className={`py-6 text-sm ${muted}`}>No managed users found.</p>
          ) : (
            recentUsers.map((user) => (
              <div className="flex flex-wrap items-center justify-between gap-3 py-3" key={user.id}>
                <div>
                  <p className="font-medium">{user.fullName || "Unnamed user"}</p>
                  <p className={`text-sm ${muted}`}>{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-500">
                    {user.role}
                  </span>
                  <p className={`mt-2 text-xs ${muted}`}>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
