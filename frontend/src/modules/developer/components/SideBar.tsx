import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, LogOut, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { logout } from "../../auth/auth.slice";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { company } = useAppSelector((state) => state.company);
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/developer/login");
  };

  return (
    <aside className="w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        {company?.logoUrl ? (
          <img
            src={company.logoUrl}
            alt="company logo"
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
            {company?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}

        <div className="flex flex-col leading-tight">
          <h2 className="text-sm font-semibold">
            {company?.name || "Company"}
          </h2>
          <span className="text-[10px] text-slate-400">
            powered by DevSync
          </span>
        </div>
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
          <FolderKanban size={18} />
          Projects
        </NavLink>
      </nav>

      <NavLink
  to={`/developer/settings`}
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
};

export default Sidebar;
