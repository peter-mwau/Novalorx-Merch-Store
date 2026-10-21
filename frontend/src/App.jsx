import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageItems from "./pages/Admin/ManageItems";
import Report from "./pages/Admin/Report";
import { useAuth } from "./contexts/AuthContext.jsx";

function AdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;
  return isAdmin ? <AdminPage /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-items" element={<ManageItems />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
