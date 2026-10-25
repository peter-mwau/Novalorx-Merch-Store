import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, Search, Trash2, X } from "lucide-react";
import { useAdmin } from "../../contexts/adminContext.jsx";
import { useTheme } from "../../contexts/themeContext.jsx";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value))
    : "Never";

function ManageUsers() {
  const {
    users,
    getAllUsers,
    updateUserById,
    deleteUserById,
  } = useAdmin();
  const { darkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllUsers().catch(() => setError("Unable to load users."));
  }, [getAllUsers]);

  const managedUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role !== "ADMIN" &&
          [user.fullName, user.email, user.role].some((value) =>
            value?.toLowerCase().includes(query.toLowerCase()),
          ),
      ),
    [query, users],
  );

  const panel = darkMode
    ? "bg-slate-950/80 text-white ring-white/10"
    : "bg-white text-slate-900 ring-slate-200";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const input = darkMode
    ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500"
    : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400";

  const saveUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateUserById(editingUser.id, {
        fullName: editingUser.fullName.trim() || null,
        phone: editingUser.phone.trim() || null,
        role: editingUser.role,
        isActive: editingUser.isActive,
      });
      setEditingUser(null);
    } catch {
      setError("Unable to update this user.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setSaving(true);
    setError("");
    try {
      await deleteUserById(deletingUser.id);
      setDeletingUser(null);
    } catch {
      setError("Unable to delete this user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            User administration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Manage users</h1>
          <p className={`mt-2 ${muted}`}>Admin accounts are protected and hidden from this list.</p>
        </div>
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${input}`}>
          <Search size={18} className={muted} />
          <input
            className="w-44 bg-transparent text-sm outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users..."
            value={query}
          />
        </div>
      </header>

      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

      <section className={`overflow-hidden rounded-2xl ring-1 ${panel}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className={darkMode ? "bg-white/[0.04]" : "bg-slate-50"}>
              <tr>
                {["User", "Role", "Status", "Last login", "Actions"].map((heading) => (
                  <th className={`px-5 py-4 font-semibold ${muted}`} key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {managedUsers.map((user) => (
                <tr className="transition hover:bg-cyan-500/[0.04]" key={user.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{user.fullName || "Unnamed user"}</p>
                    <p className={`mt-1 text-xs ${muted}`}>{user.email}</p>
                  </td>
                  <td className="px-5 py-4"><span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-500">{user.role}</span></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${user.isActive ? "text-emerald-500" : "text-slate-400"}`}>
                      <span className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={`px-5 py-4 ${muted}`}>{formatDate(user.lastLogin)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="rounded-lg p-2 text-cyan-500 transition hover:bg-cyan-500/10" onClick={() => setEditingUser({ ...user })} title="Edit user" type="button"><Edit3 size={17} /></button>
                      <button className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10" onClick={() => setDeletingUser(user)} title="Delete user" type="button"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {managedUsers.length === 0 && <p className={`px-5 py-10 text-center ${muted}`}>No users match your search.</p>}
      </section>

      {editingUser && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" role="dialog">
          <form className={`w-full max-w-md space-y-4 rounded-2xl p-6 ring-1 ${panel}`} onSubmit={saveUser}>
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Edit user</h2><button onClick={() => setEditingUser(null)} type="button"><X /></button></div>
            <label className="block text-sm font-medium">Full name<input className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })} value={editingUser.fullName || ""} /></label>
            <label className="block text-sm font-medium">Phone<input className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} value={editingUser.phone || ""} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Role<select className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none ${input}`} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} value={editingUser.role}><option value="CUSTOMER">Customer</option><option value="STAFF">Staff</option></select></label>
              <label className="block text-sm font-medium">Status<select className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none ${input}`} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === "true" })} value={String(editingUser.isActive)}><option value="true">Active</option><option value="false">Inactive</option></select></label>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50" disabled={saving} type="submit"><Check size={18} />{saving ? "Saving..." : "Save changes"}</button>
          </form>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" role="dialog">
          <div className={`w-full max-w-md space-y-5 rounded-2xl p-6 ring-1 ${panel}`}>
            <h2 className="text-xl font-bold">Delete user?</h2>
            <p className={muted}>This permanently removes <strong className="text-current">{deletingUser.fullName || deletingUser.email}</strong> and cannot be undone.</p>
            <div className="flex justify-end gap-3"><button className={`rounded-xl px-4 py-2.5 ring-1 ${input}`} onClick={() => setDeletingUser(null)} type="button">Cancel</button><button className="rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white hover:bg-red-600 disabled:opacity-50" disabled={saving} onClick={confirmDelete} type="button">{saving ? "Deleting..." : "Delete user"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
