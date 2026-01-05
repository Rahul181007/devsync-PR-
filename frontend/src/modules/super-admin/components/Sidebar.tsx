import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hook";
import { logout } from "../../auth/auth.slice";

const Sidebar = () => {
    const dispatch=useAppDispatch();
    const navigate=useNavigate()

    const handleLogout=async()=>{
        await dispatch(logout());
        navigate('/super-admin/login',{replace:true})
    }
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-8">DevSync</h2>

      <nav className="space-y-2">
        <NavLink
          to="/super-admin/dashboard"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-slate-700" : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/super-admin/companies"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-slate-700" : "hover:bg-slate-800"
            }`
          }
        >
          Companies
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-red-400"
        >
          Logout
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;
