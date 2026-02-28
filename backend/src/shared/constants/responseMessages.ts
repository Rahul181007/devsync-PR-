export const RESPONSE_MESSAGES = {
    AUTH: {

        UNAUTHORIZED: "Unauthorized",
        FORBIDDEN: "Access denied",
        INVALID_CREDENTIALS: "Invalid email or password",
        USER_NOT_ACTIVE: "User account is not active",
        INVALID_ROLE: "Invalid role for this action",
        INVALID_REFRESH_TOKEN: "Invalid refresh token",
        ACCOUNT_NOT_FOUND: "Account not found",
        PASSWORD_RESET_SUCCESS: "Password reset successfully",
        OTP_SENT_SUCCESS: "OTP send successfully",
        OTP_NOT_VERIFIED: 'Otp not verified',
        INVALID_OTP: "Invalid or expired OTP",
        OTP_VERIFIED: "OTP verified",
        OTP_ALREADY_VERIFIED: 'Otp is alreafy exist',
        OTP_EXPIRED: 'Otp is expired',
        USER_CREATION_FAILED: "Failed to create user account",
        ALREADY_BLOCKED: "User is already blocked",
        ALREADY_ACTIVE: "User is already active",
        TARGET_NOT_COMPANY_ADMIN: "Target user is not a company admin",
        LOGIN_SUCCESS: "Login Successful",
        TOKEN_REFRESHED: 'New token generated',
        LOGOUT_SUCCESS: 'Logged out successfully',
        USER_ID: 'User id is required',
        USER_ALREADY_EXISTS: 'User Already exist',
        USER_CREATED: 'User created successfully',
        USER_BLOCKED: 'User isblocked',
        COMPANY_NOT_FOUND: 'Company not found',
        WAITING_FOR_APPROVAL: 'Waiting for approval',
        ONBOARDING_REQUIRED: 'Onboarding required',
        WORKSPACE_CREATION_NOT_ALLOWED: 'Workspace creation is not allowed',
        WORKSPACE_ALREADY_EXISTS: 'Workspace is already exist',
        EMAIL_NOT_VERIFIED: 'Email not verified',
        USE_GOOGLE_LOGIN: 'use google login',
        USE_PASSWORD_LOGIN: 'user password login',
        NAME_REQUIRED: "Name is required",
        USER_ALREADY_VERIFIED: "User already verified"
    },

    COMPANY: {
        CREATED: "Company created successfully",
        APPROVED: "Company approved successfully",
        SUSPENDED: "Company suspended successfully",
        NOT_FOUND: "Company not found",
        ALREADY_EXISTS: "Company already exists",
        NOT_PENDING: 'Company is not in pending state',
        DOMAIN_ALREADY_EXISTS: 'Domain already exists',
        ADMIN_EMAIL_ALREADY_EXISTS: 'Admin email already exists',
        COMPANY_NOT_SUSPENDED: 'Company cannot be suspended',
        NOT_APPROVED: 'Company is not approved',
        COMPANY_ID: 'Company id is required',
        WORKSPACE_CREATED: 'Workspace created',
        BRANDING_UPDATED: 'Branding updated',
        REJECTION_REASON: '"Rejection reason is required"',
        REJECTED: 'Rejected',
        REAPPLIED: 'Reapplied',

    },

    INVITE: {
        SENT: "Invite sent successfully",
        RESENT: "Invite resent successfully",
        INVALID: "Invalid or expired invite",
        INVALID_TOKEN: 'Invalid invite token',
        NOT_PENDING: 'Invite is no longer valid',
        EXPIRED: 'Invite has expired',
        ONLY_SUPER_ADMIN: 'Only super admin can invite company admin',
        INVALID_ROLE: 'Invalid role for invite',
        ALREADY_ASSIGNED: 'Company admin is already assigned',
        CREATE_FAILED: 'Failed to create invite',
        UPDATED: 'Invite updated successfully',
        VERIFICATION: 'Verification was successsful',
        ONLY_COMPANY_ADMIN: 'Only company admin can invite  developer'
    },
    USER: {
        COMPANY_ADMIN_BLOCKED: "Company admin blocked successfully",
        COMPANY_ADMIN_UNBLOCKED: "Company admin unblocked successfully",
        USER_ID_REQUIRED: "User id is required",
        NOT_FOUND: 'User not found',
        DEVELOPER_BLOCKED: 'Developer is blocked',
        DEVELOPER_UNBLOCKED: 'Developer is unblocked',
        NOT_BELONG_TO_COMPANY: "User does not belong to this company"
    },
    PROJECT: {
        ALREADY_EXISTS: 'Project already exist',
        CREATED: 'Project created',
        PROJECT_NOT_FOUND: 'Project  not found',
        ACCESS_DENIED: 'Access denied',
        ARCHIVED: 'Archived',
        COMPLETED: "Completed",
        USER_NOT_IN_COMPANY: 'User not in company',
        MEMBER_ALREADY_EXISTS: 'Member already exist',
        MEMBER_NOT_FOUND: 'Member not found',
        LIST_FETCHED: 'List fetched',
        ID_REQUIRED: 'ProjectId is required',
        FETCHED: 'project fetched',
        UPDATED: 'Project is updated',
        MEMBER_ADDED: 'MEMBER ADDED',
        CANNOT_REMOVE_OWNER: 'Cannot remove an owner',
        DEVELOPER_ONLY_BE_ADDED: 'Developer can only be added',
        COMPANY_ID_NOT_MATCHING:'project company id is not matching',
        PROJECT_NOT_ACTIVE:"Project not active"
    },
    TASK: {
        INVALID_ASSIGNEE: "Invalid assignee",
        INVALID_DUE_DATE: "Invalid due date",
        NOT_FOUND: "Task not found",
        INVALID_STATUS_TRANSITION: 'Invalid status transistion',
        NOT_ASSIGNED_TO_YOU: "Task not assigned to you",
        NOT_IN_SPRINT: "Task not in sprint",
        NOT_IN_ACTIVE_SPRINT: "Task not in active sprint",
        TASK_NOT_BELONG_PROJECT: "Task not belong to project",
        ALREADY_ASSIGNED_TO_SPRINT: "Task is already assigned to a sprint",
        ASSIGNED_USER: "Assigned user must be a developer"
    },

    SPRINT: {
        ACTIVE_SPRINT_EXISTS: "Active sprint exist",
        SPRINT_NAME_EXISTS: "Sprint name already exists in this project",
        SPRINT_DATE_OVERLAP: "Sprint dates overlap with an existing sprint",
        SPRINT_NOT_FOUND: "Sprint not found",
        DEVELOPER_NOT_IN_PROJECT: "Developer does not belong to this project",
        TASK_ALREADY_ASSIGNED: "Task is already assigned to a sprint",
        SPRINT_COMPLETED: "Cannot modify completed sprint",
        SPRINT_NOT_BELONG_PROJECT: "Sprint Not belong to project",
        SPRINT_NOT_PLANNABLE:"Sprint not planable",
        SPRINT_EMPTY:"sprint is empty",
        SPRINT_ACTIVATED:"Sprint activated successfully",
        SPRINT_NOT_ACTIVE:"Sprint not active",
    },
    DEVELOPER: {
        NOT_BELONG_TO_COMPANY: "Developer does not belong to this company",
        BLOCKED: "Developer is blocked",
        UNBLOCKED: "Developer is unblocked",
        NOT_BELONG_TO_PROJECT:"Developer does not belong to this project"
    },
    COMPANYADMIN:{
        NOT_BELONG_TO_COMPANY: "CompanyAdmin does not belong to this company"
    },

    STANDUP:{
       ALREADY_SUBMITTED:"Standup already submitted",
        CREATED: "Standup submitted successfully",
        NOT_FOUND:"Standup not found",
        UPDATED:"Standup updated successfully"
    },
    CHAT:{
        REPLY_MESSAGE_NOT_FOUND:"Reply message not found"
    },


    COMMON: {
        INTERNAL_ERROR: "Something went wrong",

    },
} as const;
