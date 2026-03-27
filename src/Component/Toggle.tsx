import { useState, useEffect } from "react";

export function NavbarToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="inline-block relative mt-1">
      <label className="relative inline-flex items-center w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        {/* Slider track */}
        <div
          className={`absolute inset-0 rounded-full transition-colors duration-300 ${
            darkMode ? "bg-blue-600" : "bg-gray-300"
          }`}
        ></div>

        {/* Knob */}
        <div
          className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            darkMode ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>

        {/* Sun & Moon */}
        <span className="absolute left-1 top-1 text-yellow-400 text-sm pointer-events-none">
          🌞
        </span>
        <span className="absolute right-1 top-1 text-gray-800 text-sm pointer-events-none">
          🌙
        </span>
      </label>
    </div>
  );
}