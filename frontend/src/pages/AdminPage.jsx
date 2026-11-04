import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-3 pb-12 pt-20 sm:gap-6 sm:px-4 md:flex-row md:pt-24">
      <AdminSidebar />
      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </main>
  );
}

export default AdminPage;
