import { BrowserRouter, Routes, Route } from "react-router-dom";

// auth
import SuperAdminLoginPage from "../modules/auth/pages/SuperAdminLoginPage";
import UserLoginPage from "../modules/auth/pages/UserLoginPAge";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import VerifyOtpPage from "../modules/auth/pages/VerifyOtpPage";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";
import AcceptInvitePage from "../modules/auth/pages/AcceptInvitePage";

// super admin
import SuperAdminLayout from "../modules/super-admin/components/SuperAdminLayout";
import DashboardPage from "../modules/super-admin/pages/DashboardPage";
import CompaniesPage from "../modules/super-admin/pages/CompaniesPage";
import CompanyDetailPage from "../modules/super-admin/pages/CompanyDetailPage";

// company admin
import CompanyAdminLayout from "../modules/company-admin/components/CompanyAdminLayout";
import CompanyDashboardPage from "../modules/company-admin/pages/DashboardPage";

// developer
import DeveloperLayout from "../modules/developer/components/DeveloperLAyout";
import DevDashboard from "../modules/developer/pages/DevDashboard";

// guards
import ProtectedRoute from "./ProtectedRoutes";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />

        <Route path="/company/login" element={<UserLoginPage />} />
        <Route path="/company/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/developer/login" element={<UserLoginPage />} />
        <Route path="/developer/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Invite */}
        <Route path="/invite/accept" element={<AcceptInvitePage />} />

        {/* ================= SUPER ADMIN ================= */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["SUPER_ADMIN"]}
              loginPath="/super-admin/login"
            />
          }
        >
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/:companyId" element={<CompanyDetailPage />} />
          </Route>
        </Route>

        {/* ================= COMPANY ADMIN ================= */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["COMPANY_ADMIN"]}
              loginPath="/company/login"
            />
          }
        >
          <Route path="/company" element={<CompanyAdminLayout />}>
            <Route path="dashboard" element={<CompanyDashboardPage />} />
          </Route>
        </Route>

        {/* ================= DEVELOPER ================= */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["DEVELOPER"]}
              loginPath="/developer/login"
            />
          }
        >
          <Route path="/developer" element={<DeveloperLayout />}>
            <Route path="dashboard" element={<DevDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


