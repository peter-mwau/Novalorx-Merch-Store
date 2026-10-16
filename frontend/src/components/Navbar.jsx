import { useState } from "react";
import AuthModal from "./auth/AuthModal";

function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">My App</h1>

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
      <button
        onClick={() => setAuthOpen(true)}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
      >
        Sign in
      </button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default Navbar;
