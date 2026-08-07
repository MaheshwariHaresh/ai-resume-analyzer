import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Brain,
  User,
  Sparkles,
  LogOut,
  History,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resume History",
    path: "/dashboard/history",
    icon: FileText,
  },
  {
    name: "Interview Coach",
    path: "/dashboard/interview",
    icon: Brain,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: User,
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  return (
    <aside
      className={`relative h-screen bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Collapse Button */}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-8 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center hover:bg-gray-100 z-10"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo */}

      <div className="px-6 py-8 border-b">
        <div className="flex items-center justify-center">
          <span className="text-3xl">🤖</span>
        </div>

        {!collapsed && (
          <div className="text-center mt-3">
            <h2 className="text-2xl font-bold text-blue-600">AI Resume</h2>

            <p className="text-sm text-gray-500">Analyzer</p>
          </div>
        )}
      </div>

      {/* Analyze Resume Button */}

      <div className="p-4">
        <NavLink
          to="/dashboard/analyze"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
        >
          <Sparkles size={18} />

          {!collapsed && <span>Analyze Resume</span>}
        </NavLink>
      </div>

      {/* Menu */}

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      collapsed ? "justify-center" : "gap-3"
                    } px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} />

                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress Card */}

      {!collapsed && (
        <div className="mx-4 mb-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
          <p className="text-sm text-blue-100">Average ATS Score</p>

          <h2 className="text-3xl font-bold mt-2">84%</h2>

          <div className="w-full h-2 bg-white/20 rounded-full mt-4">
            <div className="w-[84%] h-full bg-white rounded-full"></div>
          </div>

          <p className="text-xs text-blue-100 mt-3">
            Keep improving your resume 🚀
          </p>
        </div>
      )}

      {/* User Section */}

      <div className="border-t p-5">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="text-blue-600" size={20} />
          </div>

          {!collapsed && (
            <div>
              <h3 className="font-semibold">Haresh Kumar</h3>

              <p className="text-xs text-gray-500">Backend Developer</p>
            </div>
          )}
        </div>

        <button
          className={`mt-5 flex items-center justify-center rounded-xl border py-3 transition text-red-500 hover:bg-red-50 ${
            collapsed ? "w-11 mx-auto" : "w-full gap-2"
          }`}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={18} />

          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
