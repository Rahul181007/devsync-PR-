import { HiOutlineUserCircle } from "react-icons/hi2";
import NotificationBell from "../../notification/components/NotificationBell";
import { Link } from "react-router-dom";


type TopBarProps = {
  onMenuClick: () => void;
};
const TopBar = ({ onMenuClick }: TopBarProps) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
          ☰
        </button>
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">D</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Developer
        </h1>
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
          Dev
        </span>
      </div>

      <div className="flex items-center gap-4">

        {/* Real Notification Bell */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Profile Icon */}
        <div className="h-8 w-px bg-gray-200"></div>
        <Link to="/developer/settings">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <HiOutlineUserCircle className="text-xl text-gray-600 group-hover:text-gray-800 transition-colors" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-gray-700">Admin User</p>

            </div>
          </div>
        </Link>

      </div>
    </header>
  );
};

export default TopBar;