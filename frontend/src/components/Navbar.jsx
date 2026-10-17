import { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../contexts/AuthContext.jsx";
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
      <div className="flex flex-row items-center space-x-4">
        <div className="flex justify-center rounded-full bg-gray-700 p-2 hover:bg-gray-600 cursor-pointer">
          <User />
        </div>
        <div className="flex justify-center mt-2">
          <ChevronDown />
        </div>
        <div className="flex justify-center mt-2">
          <ChevronUp />
        </div>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-200 sm:inline">
            {user?.fullName || user?.email}
          </span>
          <button
            onClick={() => logout()}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
          >
            Log out
          </button>
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
