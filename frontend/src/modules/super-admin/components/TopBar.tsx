import { HiOutlineUserCircle } from "react-icons/hi2";
import NotificationBell from "../../notification/components/NotificationBell"; 

const TopBar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">SA</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Super Admin
        </h1>
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
          Admin
        </span>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Real Notification Bell */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Profile Icon */}
        <div className="h-8 w-px bg-gray-200"></div>
        <a href="/super-admin/settings" className="group">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <HiOutlineUserCircle className="text-xl text-gray-600 group-hover:text-gray-800 transition-colors" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-400">superadmin@company.com</p>
            </div>
          </div>
        </a>
        
      </div>
    </header>
  );
};

export default TopBar;