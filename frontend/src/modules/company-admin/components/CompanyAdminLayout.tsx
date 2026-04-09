import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getMyCompany } from "../store/company.slice";

const CompanyAdminLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (user?.companySlug) {
      dispatch(getMyCompany());
    }
  }, [user, dispatch]);

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

export default CompanyAdminLayout;