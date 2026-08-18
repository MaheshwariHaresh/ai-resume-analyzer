import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-3">
            <Outlet />
          </main>

          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
