import { NavLink } from "react-router-dom";

const Sidebar = () => {
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
      </nav>

      <div className="mt-auto pt-10 text-sm text-gray-400">
        © DevSync
      </div>
    </aside>
  );
};

export default Sidebar;
