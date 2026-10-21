import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const sidebarLinks = [
    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Manage Users",
      path: "/admin/manage-users",
    },
    {
      name: "Manage Items",
      path: "/admin/manage-items",
    },
    { name: "Report", path: "/admin/report" },
  ];

  return (
    <aside className="w-full shrink-0 rounded-2xl bg-slate-900 p-4 text-white md:w-60">
      <h1 className="mb-4 text-xl font-bold">Admin</h1>
      <nav aria-label="Admin navigation">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-cyan-500 font-semibold text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <NavLink
        to="/"
        className="mt-6 block px-3 text-sm text-slate-400 hover:text-white"
      >
        Back to store
      </NavLink>
    </aside>
  );
}

export default AdminSidebar;
