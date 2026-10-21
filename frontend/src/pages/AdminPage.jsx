import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-12 pt-28 md:flex-row">
      <AdminSidebar />
      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </main>
  );
}

export default AdminPage;
