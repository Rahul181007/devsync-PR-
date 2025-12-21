import { BrowserRouter, Routes, Route } from "react-router-dom";

// auth
import SuperAdminLoginPage from "../modules/auth/pages/SuperAdminLoginPage";

// super admin workspace
import SuperAdminLayout from "../modules/super-admin/components/SuperAdminLayout";
import DashboardPage from "../modules/super-admin/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoutes";
import UserLoginPage from "../modules/auth/pages/UserLoginPAge";
import CompanyAdminLayout from "../modules/company-admin/components/CompanyAdminLayout";
import CompanyDashboardPage from "../modules/company-admin/pages/DashboardPage";

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
        <Route element={<ProtectedRoute  allowedRoles="SUPER_ADMIN" loginPath="/super-admin/login"/>}>
         <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        </Route>
        


        <Route 
        path="/company/login"
        element={<UserLoginPage/>}
        />
        {/* Company Admin Workspace */}
        <Route  element={<ProtectedRoute allowedRoles="COMPANY_ADMIN" loginPath="/company/login"/>}>
        <Route path="/company" element={<CompanyAdminLayout/>}>
         <Route path='dashboard' element={<CompanyDashboardPage/>}/>
        </Route>
        
        </Route>


      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

