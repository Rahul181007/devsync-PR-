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
import AppRoute from "./ProtectedRoutes";
import OnboardingRoute from "./OnboardingRoute";
import LandingPage from "../modules/landing/pages/LandingPage";
import NotFoundPage from "../modules/landing/pages/error/NotFoundPage";
import CompanySignupPage from "../modules/auth/pages/CompanySignupPage";
import WorkspacePage from "../modules/company-admin/pages/Onboarding/WorkspacePage";
import BrandingPage from "../modules/company-admin/pages/Onboarding/BrandingPage";
import CreateProjectPage from "../modules/company-admin/pages/Onboarding/CreateProjectPage";
import PendingApprovalPage from "../modules/company-admin/pages/PendingApprovalPage";
import { DevelopersPage } from "../modules/company-admin/pages/DevelopersPage";
import RejectedCompanyPage from "../modules/company-admin/pages/RejectedCompanyPage";
import SuspendedCompanyPage from "../modules/company-admin/pages/SuspendedCompanyPage";
import { ProjectListingPage } from "../modules/company-admin/pages/projects/ProjectListingPage";
import ProjectDetailPage from "../modules/company-admin/pages/projects/ProjectDetailPage";
import { DevProjectListingPage } from "../modules/developer/pages/projects/DevProjectListingPage";
import { DevProjectDetailPage } from "../modules/developer/pages/projects/DevProjectDetailPage";
import PlanListPage from "../modules/super-admin/pages/plan/PlanLIstPage";
import BillingPage from "../modules/company-admin/pages/billing/BillingPage";
import InvoicePage from "../modules/company-admin/pages/billing/InvoicePage";
import PaymentMethodPage from "../modules/company-admin/pages/billing/PaymentMethodPage";
import PaymentFailedPage from "../modules/company-admin/pages/billing/PaymentFailedPage";
import PaymentSuccessPage from "../modules/company-admin/pages/billing/PaymentSuccessPage";
import SettingsPage from "../modules/settings/pages/SettingsPage";
import TransactionListPage from "../modules/super-admin/pages/transactions/TransactionListPage";



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
        <Route path={ROUTES.AUTH.COMPANY_SIGNUP} element={<CompanySignupPage />} />

        {/* ================= SUPER ADMIN ================= */}
        <Route
          element={
            <AppRoute
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
            <Route path="plans" element={<PlanListPage/>} />
            <Route path='settings'element={<SettingsPage/>} />
            <Route path='transactions'element={<TransactionListPage/>} />
          </Route>
        </Route>



        {/* ================= COMPANY ADMIN ================= */}
        <Route path={ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING} element={<OnboardingRoute />}>
          <Route path={ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_WORKSPACE} element={<WorkspacePage />} />
          <Route path={ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_BRANDING} element={<BrandingPage />} />
          <Route path={ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_PROJECT} element={<CreateProjectPage />} />
        </Route>

        <Route
          path={ROUTES.COMPANY_ADMIN.COMPANY_PENDING_APPROVAL}
          element={<PendingApprovalPage />}
        />
        <Route path={ROUTES.COMPANY_ADMIN.COMPANY_REJECTED} element={<RejectedCompanyPage />} />
        <Route
          path={ROUTES.COMPANY_ADMIN.COMPANY_SUSPENDED}
          element={<SuspendedCompanyPage />}
        />




        <Route
          element={
            <AppRoute
              allowedRoles={["COMPANY_ADMIN"]}
              loginPath={ROUTES.AUTH.COMPANY_LOGIN}
            />
          }
        >
          <Route path={'/company/:companySlug'} element={<CompanyAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CompanyDashboardPage />} />
            <Route path="users" element={<DevelopersPage />} />
            <Route path='projects'element={<ProjectListingPage/>} />
            <Route path="projects/:projectId" element={<ProjectDetailPage />} />
            <Route path='billing'element={<BillingPage/>} />
            <Route path="billing/invoice" element={<InvoicePage />} />
            <Route path="billing/payment-method" element={<PaymentMethodPage />} />
            <Route path="billing/failed" element={<PaymentFailedPage />} />
            <Route path="billing/success" element={<PaymentSuccessPage />} />
            <Route path='settings'element={<SettingsPage/>} />
          </Route>
        </Route>




        {/* ================= DEVELOPER ================= */}
        <Route
          element={
            <AppRoute
              allowedRoles={["DEVELOPER"]}
              loginPath={ROUTES.AUTH.DEVELOPER_LOGIN}
            />
          }
        >
          <Route path='/developer' element={<DeveloperLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DevDashboard />} />
            <Route path="projects" element={<DevProjectListingPage />}/>
            <Route path="projects/:projectId" element={<DevProjectDetailPage/>}/>
            <Route path='settings'element={<SettingsPage/>} />
          </Route>
        </Route>
        {/* ================= Error================= */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


