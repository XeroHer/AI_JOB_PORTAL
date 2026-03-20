import React, { useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar1 = ({ firstName, avatar, onAvatarChange, isSidebarOpen, toggleSidebar }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex justify-between items-center bg-white shadow-md px-4 py-3 rounded-md">
      {/* Left side: mobile menu + greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>

        {/* Greeting */}
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {firstName || "User"}
        </h2>
      </div>

      {/* Right side: notifications and avatar */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative">
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
          🔔
        </button>

        {/* Avatar */}
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer object-cover"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar1;