// src/constants/api.routes.ts

export const API_ROUTES = {
  SUPER_ADMIN: {
    BASE: "/superadmin",

    DASHBOARD: "/superadmin/dashboard",

    COMPANIES: "/superadmin/companies",
    COMPANY_BY_ID: (id: string) => `/superadmin/companies/${id}`,
    INVITE_COMPANY_ADMIN: (id: string) =>
      `/superadmin/companies/${id}/invite`,
    APPROVE_COMPANY: (id: string) =>
      `/superadmin/companies/${id}/approve`,
    SUSPEND_COMPANY: (id: string) =>
      `/superadmin/companies/${id}/suspend`,
    UNSUSPEND_COMPANY: (id: string) =>
      `/superadmin/companies/${id}/unsuspend`,
    REJECT_COMPANY: (id: string) =>
      `/superadmin/companies/${id}/reject`,

    PLANS: "/superadmin/plans",
    PLAN_BY_ID: (id: string) => `/superadmin/plans/${id}`,

    TRANSACTIONS: "/superadmin/transactions",
    DOWNLOAD_INVOICE: (id: string) =>
      `/superadmin/invoices/${id}/download`,

    BLOCK_USER: (id: string) => `/superadmin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/superadmin/users/${id}/unblock`,
  },


  COMPANY: {
    BASE: "/company",

    DASHBOARD: "/company/dashboard",

    // Subscription / Billing
    SUBSCRIPTION: "/company/subscription",
    PLANS: "/company/plans",
    PAYMENTS: "/company/payments",
    CREATE_PAYMENT: "/company/payment/create",
    VERIFY_PAYMENT: "/company/payment/verify",
    DOWNLOAD_INVOICE: (id: string) => `/company/invoice/${id}`,

    // Company
    WORKSPACE: "/company/workspace",
    ME: "/company/me",
    BRANDING: "/company/branding",

    // Developers
    DEVELOPERS: "/company/developers",
    INVITE_DEVELOPER: "/company/invite-developer",
    BLOCK_DEVELOPER: (id: string) => `/company/developers/${id}/block`,
    UNBLOCK_DEVELOPER: (id: string) => `/company/developers/${id}/unblock`,

    // Projects
    PROJECTS: "/company/projects",
    FIRST_PROJECT: "/company/projects/first",
    PROJECT_BY_ID: (id: string) => `/company/projects/${id}`,
    PROJECT_MEMBERS: (projectId: string) =>
      `/company/projects/${projectId}/members`,
    PROJECT_MEMBER_BY_ID: (projectId: string, memberId: string) =>
      `/company/projects/${projectId}/members/${memberId}`,

    // Sprints
    SPRINTS: (projectId: string) =>
      `/company/projects/${projectId}/sprints`,
    SPRINT_BY_ID: (projectId: string, sprintId: string) =>
      `/company/projects/${projectId}/sprints/${sprintId}`,
    ACTIVATE_SPRINT: (projectId: string, sprintId: string) =>
      `/company/projects/${projectId}/sprints/${sprintId}/activate`,
    COMPLETE_SPRINT: (projectId: string, sprintId: string) =>
      `/company/projects/${projectId}/sprints/${sprintId}/complete`,
    PLAN_SPRINT: (projectId: string) =>
      `/company/projects/${projectId}/sprints/plan`,

    // Standups
    STANDUP_TODAY: (projectId: string) =>
      `/company/projects/${projectId}/standups/today`,
    STANDUP_HISTORY: (projectId: string) =>
      `/company/projects/${projectId}/standups/history`,
    
    STANDUP_DETAIL: (projectId: string, standupId: string) =>
      `/company/projects/${projectId}/standups/${standupId}`,

    
    // Tasks
    TASKS: (projectId: string) =>
      `/company/projects/${projectId}/tasks`,

    TASK_BY_ID: (projectId: string, taskId: string) =>
      `/company/projects/${projectId}/tasks/${taskId}`,
    TASK_STATUS: (projectId: string, taskId: string) =>
      `/company/projects/${projectId}/tasks/${taskId}/status`,


    TASK_COMMENTS: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}/comments`,
    TASK_ATTACHMENTS: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}/attachments`,

    // Worklogs
    TASK_WORKLOGS: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}/worklogs`,
    PROJECT_WORKLOGS: (projectId: string) =>
      `/company/projects/${projectId}/worklogs`,
    PROJECT_TIMESHEET: (projectId: string) =>
      `/company/projects/${projectId}/timesheet`,
    REAPPLY:"/company/reapply",
  },

  DEVELOPER: {
  BASE: "/developer",

  DASHBOARD: "/developer/dashboard",

  // Projects
  PROJECTS: "/company/projects",
  PROJECT_BY_ID: (projectId: string) =>
    `/company/projects/${projectId}`,

  // Standups
  STANDUPS: (projectId: string) =>
    `/developer/projects/${projectId}/standups`,

  // Tasks
  TASKS: (projectId: string) =>
    `/developer/projects/${projectId}/tasks`,
  TASK_BY_ID: (projectId: string, taskId: string) =>
    `/developer/projects/${projectId}/tasks/${taskId}`,
  TASK_STATUS: (projectId: string, taskId: string) =>
    `/developer/projects/${projectId}/tasks/${taskId}/status`,
  SUBMIT_TASK: (projectId: string, taskId: string) =>
    `/developer/projects/${projectId}/tasks/${taskId}/submit`,

  // Comments
  TASK_COMMENTS: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}/comments`,

  // Attachments
  TASK_ATTACHMENTS: (projectId: string, taskId: string) =>
    `/projects/${projectId}/tasks/${taskId}/attachments`,

  // Worklogs
  TASK_WORKLOGS: (projectId: string, taskId: string) =>
    `/developer/projects/${projectId}/tasks/${taskId}/worklogs`,
  WORKLOG_BY_ID: (projectId: string, worklogId: string) =>
    `/developer/projects/${projectId}/worklogs/${worklogId}`,
  GET_TASK_WORKLOGS: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}/worklogs`,
},

AUTH: {
  BASE: "/auth",

  SUPERADMIN_LOGIN: "/auth/superadmin/login",
  LOGIN: "/auth/login",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",

  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",

  SIGNUP: "/auth/signup",
  GOOGLE_SIGNUP: "/auth/google/signup",
  VERIFY_SIGNUP_OTP: "/auth/verify-signup-otp",
  RESEND_SIGNUP_OTP: "/auth/resend-signup-otp",
  GOOGLE_LOGIN: "/auth/google/login",
},

INVITE: {
  VERIFY: "/invite/verify",
  ACCEPT: "/invite/accept",
},

COLLAB: {
  PROJECT_CHAT: (projectId: string) =>
    `/projects/${projectId}/chat`,
  AI_SUMMARY: (projectId: string) =>
    `/projects/${projectId}/ai-summary`,
},

COMMON: {
  NOTIFICATIONS: "/notifications",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
},

SETTINGS: {
  PROFILE: "/settings/profile",
  UPDATE_AVATAR: "/settings/profile/avatar",
  UPDATE_PROFILE: "/settings/profile",
  UPDATE_COMPANY_LOGO: "/settings/company/logo",

  SEND_OTP: "/settings/send-otp",
  VERIFY_OTP: "/settings/verify-otp",
  CHANGE_PASSWORD: "/settings/change-password",
},

} as const;