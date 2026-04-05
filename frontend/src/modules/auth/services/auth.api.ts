import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { AuthUser, OnboardingStep } from "../auth.slice";

export interface MeResponse {
  user: AuthUser;
  requiresOnboarding: boolean;
  waitingForApproval: boolean;
  rejectedCompany: boolean;
  rejectionReason: string | null;
  suspendedCompany: boolean
  onboardingStep: OnboardingStep;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'DEVELOPER';
    companyId?: string | null;
    companySlug?: string | null;

    accessToken: string;     // ✅ ADD
    refreshToken: string;    // ✅ ADD

    requiresOnboarding?: boolean;
    waitingForApproval?: boolean;
    onboardingStep?: OnboardingStep;

    rejectedCompany?: boolean;
    rejectionReason?: string | null;
    suspendedCompany?: boolean;
  };
}

export const authApi = {
  superAdminLogin(data: LoginRequest) {
    return http.post<LoginResponse>(API_ROUTES.AUTH.SUPERADMIN_LOGIN, data)
  },

  // company admin & developer login

  userLogin(data: LoginRequest) {
    return http.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, data)
  },
  getMe() {
    return http.get<{ data: MeResponse }>(API_ROUTES.AUTH.ME)
  },
  refresh() {
    return http.post(API_ROUTES.AUTH.REFRESH)
  },

  //password reset
  forgotPassword(email: string) {
    return http.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email })
  },

  resendSignupOtp(email: string) {
    return http.post(API_ROUTES.AUTH.RESEND_SIGNUP_OTP, { email })
  },

  verifyOtp(data: { email: string; otp: string }) {
    return http.post(API_ROUTES.AUTH.VERIFY_OTP, data)
  },

  resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    return http.post(API_ROUTES.AUTH.RESET_PASSWORD, data)
  },

  logout() {
    return http.post(API_ROUTES.AUTH.LOGOUT)
  },
  signup(data: { name: string; email: string; password: string }) {
    return http.post<{ data: { email: string } }>(API_ROUTES.AUTH.SIGNUP, data)
  },

  googleSignup(idToken: string) {
    return http.post<{ data: { email: string } }>(API_ROUTES.AUTH.GOOGLE_SIGNUP, { idToken })
  },

  verifySignupOtp(data: { email: string; otp: string }) {
    return http.post(API_ROUTES.AUTH.VERIFY_SIGNUP_OTP, data)
  },
  googleLogin(idToken: string) {
    return http.post(API_ROUTES.AUTH.GOOGLE_LOGIN, { idToken })
  },
  reapplyCompany() {
    return http.post<{ success: boolean; message: string }>(
      API_ROUTES.COMPANY.REAPPLY
    );
  }



}