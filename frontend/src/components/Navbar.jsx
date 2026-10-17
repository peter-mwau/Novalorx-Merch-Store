import { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  BellDot,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  User,
} from "lucide-react";

function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { showToast, dismissToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    const toastId = showToast("Signing out...", "loading", 0);
    try {
      await logout();
      dismissToast(toastId);
      showToast("Signed out successfully.", "success");
    } catch (error) {
      dismissToast(toastId);
      showToast(error.message || "Unable to sign out.", "error");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex flex-row items-center justify-around">
      <img
        src="/Novalorx Logo.svg"
        alt="Novalorx Labs"
        className="h-10 w-auto"
      />

      <ul className="flex space-x-4 mt-2">
        <li>
          <a href="/" className="hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:underline">
            About
          </a>
        </li>
      </ul>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex justify-center">
          <BellDot />
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>
        </div>
        <div className="flex justify-center">
          <ShoppingCart />
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>
        </div>
      </div>
      {isLoggedIn ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full bg-gray-700 p-1.5 hover:bg-gray-600"
          >
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <User size={20} className="m-1" />
            )}
            {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-56 rounded-xl bg-gray-900 p-3 shadow-xl ring-1 ring-white/10">
              <p className="truncate text-sm font-semibold">{user?.fullName || "Account"}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg bg-gray-700 px-3 py-2 text-left text-sm hover:bg-gray-600"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setAuthOpen(true)}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
        >
          Sign in
        </button>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default Navbar;
