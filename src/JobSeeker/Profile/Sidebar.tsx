import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Resume Analyzer", path: "/analyzer" },
  { name: "Job Recommendations", path: "/recommended" },
  { name: "Applications", path: "/applications" },
  
];

export default function Sidebar() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/jobs/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.name || "User");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        setUserName("User");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <aside className="w-60 flex flex-col p-4 bg-white shadow">
        <p className="text-gray-700">Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="w-60 flex flex-col p-4 ">
      {/* User Name */}
      <h2 className="text-xl font-bold mb-6">{userName}</h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="!text-black hover:bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md py-2 px-3 text-left"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}