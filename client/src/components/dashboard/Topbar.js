import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Bell, Search, ChevronDown, User, LogOut } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const profileRef = useRef(null);

  // Read search query when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";

    setSearch(query);
  }, [location.search]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);

    logout();

    navigate("/login");
  };

  // Search resumes
  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/dashboard/history");
      return;
    }

    navigate(`/dashboard/history?search=${encodeURIComponent(query)}`);
  };

  const userName = user?.fullName || "User";
  const userRole = user?.profession || "Career Seeker";

  // Generate initials
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="relative z-50 h-20 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your resumes..."
          aria-label="Search your resumes"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        />
      </form>

      {/* Right */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification */}
        <button
          type="button"
          className="relative w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-200" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-3 rounded-xl px-2 py-1.5 transition ${
              isProfileOpen ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>

            {/* User Info */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>

              <p className="text-xs text-gray-500">{userRole}</p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
            >
              {/* User Header */}
              <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {userName}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "No email available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  role="menuitem"
                >
                  <User size={18} />

                  <span>Profile</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                  role="menuitem"
                >
                  <LogOut size={18} />

                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
