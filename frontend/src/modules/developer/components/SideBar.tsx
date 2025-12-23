import { NavLink,useNavigate } from "react-router-dom";
import { LayoutDashboard,Building2,LogOut } from "lucide-react";
import { useAppDispatch } from "../../../store/hook";
import { logout } from "../../auth/auth.slice";

const Sidebar=()=>{
    const dispatch=useAppDispatch();
    const navigate=useNavigate();

    const handleLogout=async ()=>{
        await dispatch(logout());
        navigate('/developer/login')
    }

      return (
    <aside className="w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
          D
        </div>
        <h2 className="text-xl font-bold">DevSync</h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <NavLink
          to="/developer/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition ${
              isActive
                ? "bg-slate-700"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/developer/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition ${
              isActive
                ? "bg-slate-700"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Building2 size={18} />
         Project
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-slate-800"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );

}

export default Sidebar;