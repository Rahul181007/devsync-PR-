import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useState } from "react";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={openSidebar} />
        <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default SuperAdminLayout;
