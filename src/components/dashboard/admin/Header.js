import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
      <div>Welcome, Admin!</div>
    </header>
  );
};

export default Header;
