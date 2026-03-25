import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getMyCompany } from "../store/company.slice";

const CompanyAdminLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.companySlug) {
      dispatch(getMyCompany());   
    }
  }, [user,dispatch]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyAdminLayout;