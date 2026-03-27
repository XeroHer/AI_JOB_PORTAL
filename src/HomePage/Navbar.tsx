import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { NavbarToggle } from "../Component/Toggle";

export default function Navbar() {
  
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingLink, setLoadingLink] = useState("");

  // Get token and role from storage
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
    setSidebarOpen(false);
  };

  // General sidebar click handler with loading
  const handleSidebarClick = (path) => {
    setLoadingLink(path);
    setSidebarOpen(false);
    navigate(path);
    setTimeout(() => setLoadingLink(""), 500); // reset loading after navigation
  };

  // Role-based dashboard path
  const dashboardPath =
    role === "jobseeker"
      ? "/dashboard"
      : role === "recruiter"
        ? "/recuiter"
        : "/";
  const profilePath =
    role === "jobseeker"
      ? "/profile"
      : role === "recruiter"
        ? "/profile1" // or recruiter-specific profile route
        : "/";

  return (
    <nav className="w-full  shadow bg-gray-500 fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-10 py-1">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold !text-black"
        >
          <img
            src="/WhatsApp Image 2026-03-13 at 15.22.44.png"
            alt="JobAI"
            className="h-8"
          />
          AIJobPortal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex ml-auto pr-12 gap-8 text-sm ">
          <Link
            to="/jobs"
            className={`hover:underline ${location.pathname === "/jobs" ? "font-bold text-purple-600" : "!text-black"}`}
          >
            Jobs
          </Link>

          {role && (
            <Link
              to={dashboardPath}
              className={`hover:underline ${location.pathname === dashboardPath ? "font-bold text-purple-600" : "!text-black"}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Section Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <NavbarToggle/>
          {!token ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg  !text-black">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg !text-black">
                SignUp
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center md:hidden space-x-2">
  {/* Dark Mode Toggle */}
  <NavbarToggle />

  {/* Hamburger / Sidebar Button */}
  <button
    onClick={() => setSidebarOpen(true)}
    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Open menu"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-800"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
</div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-50 bg-gray-500 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center bg-white px-4 py-1 ">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-3 px-4">
          {/* Jobs Link */}
          <button
            onClick={() => handleSidebarClick("/jobs")}
            className={`block px-4 py-2 rounded-lg text-center ${
              location.pathname === "/jobs"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            } ${loadingLink === "/jobs" ? "opacity-50 pointer-events-none" : ""}`}
          >
            {loadingLink === "/jobs" ? "Loading..." : "Jobs"}
          </button>

          {/* Dashboard Link */}
          {role && (
            <button
              onClick={() => handleSidebarClick(dashboardPath)}
              className={`px-4 py-2 rounded-lg text-center ${
                location.pathname === dashboardPath
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              } ${loadingLink === dashboardPath ? "opacity-50 pointer-events-none" : ""}`}
            >
              {loadingLink === dashboardPath ? "Loading..." : "Dashboard"}
            </button>
          )}

          {/* Auth Links */}
          {!token ? (
            <>
              <button
                onClick={() => handleSidebarClick("/login")}
                className="px-4 py-2 rounded-lg  text-black text-center"
              >
                Login
              </button>
              <button
                onClick={() => handleSidebarClick("/register")}
                className="px-4 py-2 rounded-lg text-black text-center"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={() => handleSidebarClick(profilePath)}
              className="md:hidden w-full px-3 py-2 rounded-md text-black text-center"
            >
              View Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border text-black "
          >
            Logout
          </button>
          
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </nav>
  );
}
