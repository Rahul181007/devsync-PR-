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
    DASHBOARD: "/company/dashboard",
  },

  DEVELOPER: {
    BASE: "/developer",
    DASHBOARD: "/developer/dashboard",
  },
}as const