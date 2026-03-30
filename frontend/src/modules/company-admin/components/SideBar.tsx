import { NavLink,useNavigate } from "react-router-dom";
import { LayoutDashboard,Building2,LogOut, FolderKanban, CreditCard, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { logout } from "../../auth/auth.slice";

const Sidebar=()=>{
    const dispatch=useAppDispatch();
    const navigate=useNavigate();
    const {user}=useAppSelector((state)=>state.auth)
    const {company}=useAppSelector((state)=>state.company)

  
     if (!user?.companySlug) return null;

     const basePath = `/company/${user.companySlug}`;
    const handleLogout=async ()=>{
        await dispatch(logout());
        navigate('/company/login')
    }

      return (
    <aside className="w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col p-4">
 {/* Logo */}
<div className="flex items-center gap-3 mb-10 group cursor-pointer">
  {/* Company Logo */}
  {company?.logoUrl ? (
    <div className="relative">
      <img
        src={company.logoUrl}
        alt="company logo"
        className="w-10 h-10 rounded-xl object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-all duration-300 shadow-lg"
      />
      <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  ) : (
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
        {company?.name?.charAt(0)?.toUpperCase() || "C"}
      </div>
      <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )}

  {/* Company Name */}
  <div className="flex flex-col leading-tight">
    <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
      {company?.name || "Company"}
    </h2>
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-slate-400">powered by</span>
      <span className="text-[10px] font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        DevSync
      </span>
    </div>
  </div>
</div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <NavLink
          to={`${basePath}/dashboard`}
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
          to={`${basePath}/users`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition ${
              isActive
                ? "bg-slate-700"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Building2 size={18} />
          User
        </NavLink>


        <NavLink
  to={`${basePath}/projects`}
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-slate-700"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  }
>
  <FolderKanban size={18} />
  Projects
</NavLink>

<NavLink
  to={`${basePath}/billing`}
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-slate-700"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  }
>
  <CreditCard size={18} />
  Billing
</NavLink>

<NavLink
  to={`${basePath}/settings`}
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-slate-700"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  }
>
  <Settings size={18} />
  Settings
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