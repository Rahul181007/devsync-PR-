import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const DeveloperLayout = () => {
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