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
        INVALID_OTP: "Invalid or expired OTP",
        OTP_VERIFIED: "OTP verified",
        USER_CREATION_FAILED: "Failed to create user account",
        ALREADY_BLOCKED: "User is already blocked",
        ALREADY_ACTIVE: "User is already active",
        TARGET_NOT_COMPANY_ADMIN: "Target user is not a company admin",
        LOGIN_SUCCESS: "Login Successful",
        TOKEN_REFRESHED: 'New token generated',
        LOGOUT_SUCCESS: 'Logged out successfully',
        USER_ID: 'User id is required',
        USER_ALREADY_EXISTS:'User Already exist',
        USER_CREATED:'User created successfully',
        USER_BLOCKED:'User isblocked',
        COMPANY_NOT_FOUND:'Company not found',
        WAITING_FOR_APPROVAL:'Waiting for approval',
        ONBOARDING_REQUIRED:'Onboarding required'
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
        COMPANY_ID: 'Company id is required'

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
        VERIFICATION: 'Verification was successsful'
    },
    USER: {
        COMPANY_ADMIN_BLOCKED: "Company admin blocked successfully",
        COMPANY_ADMIN_UNBLOCKED: "Company admin unblocked successfully",
        USER_ID_REQUIRED: "User id is required",
    },

    COMMON: {
        INTERNAL_ERROR: "Something went wrong",
    },
} as const;
