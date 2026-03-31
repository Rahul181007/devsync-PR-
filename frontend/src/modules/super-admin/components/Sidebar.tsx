import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hook";
import { logout } from "../../auth/auth.slice";
import { Building2, CreditCard, LayoutDashboard, LogOut, Settings, Receipt } from "lucide-react";
import DevSyncLogo from "../../../assets/DevSync.png";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/super-admin/login', { replace: true });
    };

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-8">
                <img 
                    src={DevSyncLogo} 
                    alt="DevSync Logo" 
                    className="w-10 h-10 object-contain rounded-lg"
                />
                <div>
                    <h2 className="text-xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        DevSync
                    </h2>
                    <p className="text-xs text-slate-400">Super Admin</p>
                </div>
            </div>

            <nav className="space-y-2">
                <NavLink
                    to="/super-admin/dashboard"
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

                {/* Companies */}
                <NavLink
                    to="/super-admin/companies"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                            isActive
                                ? "bg-slate-700"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    <Building2 size={18} />
                    Companies
                </NavLink>

                {/* Plans */}
                <NavLink
                    to="/super-admin/plans"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                            isActive
                                ? "bg-slate-700"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    <CreditCard size={18} />
                    Plans
                </NavLink>

                <NavLink
                    to="/super-admin/transactions"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                            isActive
                                ? "bg-slate-700"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    <Receipt size={18} />
                    Transactions
                </NavLink>

                {/* Settings */}
                <NavLink
                    to="/super-admin/settings"
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

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-slate-800 w-full transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;