function Navbar() {
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
    </div>
  );
}

export default Navbar;
