export const ROUTES={
    ROOT:'/',

      AUTH: {
    SUPER_ADMIN_LOGIN: "/super-admin/login",

    COMPANY_LOGIN: "/company/login",
    COMPANY_FORGOT_PASSWORD: "/company/forgot-password",

    DEVELOPER_LOGIN: "/developer/login",
    DEVELOPER_FORGOT_PASSWORD: "/developer/forgot-password",

    VERIFY_OTP: "/verify-otp",
    RESET_PASSWORD: "/reset-password",

    ACCEPT_INVITE: "/accept-invite",
    COMPANY_SIGNUP: "/company/signup",
  },

    SUPER_ADMIN: {
    BASE: "/super-admin",
    DASHBOARD: "/super-admin/dashboard",
    COMPANIES: "/super-admin/companies",
    COMPANY_DETAIL: (companyId: string) =>
      `/super-admin/companies/${companyId}`,
  },

    COMPANY_ADMIN: {
    BASE: "/company",
    DASHBOARD: (slug: string) => `/company/${slug}/dashboard`,
    USERS: (slug: string) => `/company/${slug}/users`,
    COMPANY_ONBOARDING:'/company/onboarding',
    COMPANY_ONBOARDING_WORKSPACE:"/company/onboarding/workspace",
    COMPANY_ONBOARDING_BRANDING:"/company/onboarding/branding",
    COMPANY_ONBOARDING_PROJECT:"/company/onboarding/project",
    COMPANY_PENDING_APPROVAL:"/company/pending-approval"
  },

  DEVELOPER: {
    BASE: "/developer",
    DASHBOARD: (slug: string) => `/developer/${slug}/dashboard`,
  },
}as const