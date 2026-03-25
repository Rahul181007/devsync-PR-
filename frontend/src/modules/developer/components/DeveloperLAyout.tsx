import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useEffect } from "react";
import { getMyCompany } from "../../company-admin/store/company.slice";

const DeveloperLayout = () => {
    const dispatch=useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
const { company } = useAppSelector((state) => state.company);

useEffect(() => {
  if (user && !company) {
    dispatch(getMyCompany());
  }
}, [user, company,dispatch]);
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
    )
}
export default DeveloperLayout