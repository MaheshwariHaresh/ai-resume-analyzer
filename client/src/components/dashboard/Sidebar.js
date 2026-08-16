import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Brain,
  Sparkles,
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
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`relative h-screen shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Collapse Button */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-4 top-7 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
      >
        {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
      </button>

      {/* Logo */}
      <div
        className={`border-b border-gray-100 ${
          collapsed ? "px-3 py-6" : "px-6 py-7"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          {/* Logo Icon */}
          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <FileText className="text-white" size={22} />
          </div>

          {/* Logo Text */}
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">
                Resume<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-xs text-gray-400 mt-1">AI Career Assistant</p>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Resume CTA */}
      <div className={collapsed ? "px-3 py-5" : "px-4 py-5"}>
        <NavLink
          to="/dashboard/analyze"
          className={({ isActive }) =>
            `flex items-center ${
              collapsed ? "justify-center" : "justify-center gap-2"
            } w-full rounded-xl py-3 font-semibold text-sm transition-all duration-200 ${
              isActive
                ? "bg-blue-700 text-white shadow-md shadow-blue-600/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
            }`
          }
          title={collapsed ? "Analyze Resume" : undefined}
        >
          <Sparkles size={18} />

          {!collapsed && <span>Analyze Resume</span>}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {!collapsed && (
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>
        )}

        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center ${
                      collapsed ? "justify-center" : "gap-3"
                    } px-3.5 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-600" />
                      )}

                      <Icon
                        size={20}
                        className={`shrink-0 transition ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />

                      {!collapsed && (
                        <span className="text-sm">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Average ATS Score */}
      {!collapsed && (
        <div className="mx-4 mb-5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-5 text-white shadow-md shadow-blue-600/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-blue-100">
                Average ATS Score
              </p>

              <h2 className="mt-2 text-3xl font-bold">84%</h2>
            </div>

            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText size={17} />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="w-[84%] h-full rounded-full bg-white" />
            </div>
          </div>

          <p className="mt-3 text-xs text-blue-100">
            Keep improving your resume 🚀
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
