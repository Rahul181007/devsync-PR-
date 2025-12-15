import { BrowserRouter, Routes, Route } from "react-router-dom";

// auth
import SuperAdminLoginPage from "../modules/auth/pages/SuperAdminLoginPage";

// super admin workspace
import SuperAdminLayout from "../modules/super-admin/components/SuperAdminLayout";
import DashboardPage from "../modules/super-admin/pages/DashboardPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Admin Login */}
        <Route
          path="/super-admin/login"
          element={<SuperAdminLoginPage />}
        />

        {/* Super Admin Workspace */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

