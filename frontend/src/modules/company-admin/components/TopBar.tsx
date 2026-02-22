import { FiBell } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi2";

const TopBar = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      {/* Left Side - Title */}
      <h1 className="text-lg font-semibold text-slate-800 tracking-wide">
        Company Admin
      </h1>

      {/* Right Side - Icons */}
      <div className="flex items-center gap-6">

        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <FiBell className="text-xl text-gray-600 hover:text-slate-800 transition duration-200" />
          
          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile Icon */}
        <HiOutlineUserCircle className="text-2xl text-gray-600 hover:text-slate-800 cursor-pointer transition duration-200" />

      </div>
    </header>
  );
};

export default TopBar;