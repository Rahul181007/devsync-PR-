import { HiOutlineUserCircle } from "react-icons/hi2";
import NotificationBell from "../../notification/components/NotificationBell"; 

const TopBar = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      <h1 className="text-lg font-semibold text-slate-800 tracking-wide">
        Super Admin
      </h1>

      <div className="flex items-center gap-6">
        
        {/* Real Notification Bell */}
        <NotificationBell />

        {/* Profile Icon */}
        <HiOutlineUserCircle className="text-2xl text-gray-600 hover:text-slate-800 cursor-pointer transition duration-200" />
      </div>
    </header>
  );
};

export default TopBar;