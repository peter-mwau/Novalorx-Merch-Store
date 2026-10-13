function Footer() {
  return (
    <div className="bg-gray-800 text-white p-4 mt-auto">
      <p className="text-center text-sm">
        &copy; {new Date().getFullYear()} My App. All rights reserved.
      </p>
    </div>
  );
}

export default Footer;
