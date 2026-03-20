import { Link } from "react-router-dom";
import { HomeIcon, BriefcaseIcon, UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, toggleSidebar, userName }) => {
  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Dashboard", path: "/recuiter", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Post Job", path: "/post", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: "Applicants", path: "/recruiter/applicants", icon: <UsersIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white">
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-md p-6 flex flex-col
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex z-20
        `}
      >
        {/* Close button on mobile */}
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={toggleSidebar} aria-label="Close menu">
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Username aligned left */}
        <p className="text-xl font-bold mb-8 text-left">{userName || "User"}</p>

        {/* Navigation links */}
        <nav className="flex flex-col space-y-3">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition !text-black"
              onClick={() => toggleSidebar && toggleSidebar(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;