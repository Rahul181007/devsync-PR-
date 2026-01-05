import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from '../shared/constants/routes'
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
import LandingPage from "../modules/landing/pages/LandingPage";
import NotFoundPage from "../modules/landing/pages/error/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ROOT} element={<LandingPage />} />

        {/* ================= AUTH ================= */}
        <Route path={ROUTES.AUTH.SUPER_ADMIN_LOGIN} element={<SuperAdminLoginPage />} />

        <Route path={ROUTES.AUTH.COMPANY_LOGIN} element={<UserLoginPage />} />
        <Route path={ROUTES.AUTH.COMPANY_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

        <Route path={ROUTES.AUTH.DEVELOPER_LOGIN} element={<UserLoginPage />} />
        <Route path={ROUTES.AUTH.DEVELOPER_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

        <Route path={ROUTES.AUTH.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPasswordPage />} />

        {/* Invite */}
        <Route path={ROUTES.AUTH.ACCEPT_INVITE} element={<AcceptInvitePage />} />

        {/* ================= SUPER ADMIN ================= */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["SUPER_ADMIN"]}
              loginPath={ROUTES.AUTH.SUPER_ADMIN_LOGIN}
            />
          }
        >
          <Route path={ROUTES.SUPER_ADMIN.BASE} element={<SuperAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
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
              loginPath={ROUTES.AUTH.COMPANY_LOGIN}
            />
          }
        >
          <Route path={ROUTES.COMPANY_ADMIN.BASE} element={<CompanyAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CompanyDashboardPage />} />
          </Route>
        </Route>

        {/* ================= DEVELOPER ================= */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["DEVELOPER"]}
              loginPath={ROUTES.AUTH.DEVELOPER_LOGIN}
            />
          }
        >
          <Route path={ROUTES.DEVELOPER.BASE} element={<DeveloperLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DevDashboard />} />
          </Route>
        </Route>
        {/* ================= Error================= */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


