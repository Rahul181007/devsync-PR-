import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useEffect, useState } from "react";
import { getMyCompany } from "../../company-admin/store/company.slice";

const DeveloperLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { company } = useAppSelector((state) => state.company);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (user && !company) {
      dispatch(getMyCompany());
    }
  }, [user, company, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={openSidebar} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperLayout;