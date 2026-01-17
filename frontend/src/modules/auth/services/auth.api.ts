import { http } from "../../../core/api/http";
import type { AuthUser, OnboardingStep } from "../auth.slice";

export interface MeResponse{
    user:AuthUser;
    requiresOnboarding: boolean;
    waitingForApproval: boolean;
    onboardingStep:OnboardingStep;
}

export interface LoginRequest{
    email:string;
    password:string;
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
    requiresOnboarding?: boolean;
    waitingForApproval?: boolean;
    onboardingStep?: OnboardingStep;
  };
}

export const authApi={
       superAdminLogin(data:LoginRequest){
        return http.post<LoginResponse>('/auth/superadmin/login',data)
       },

       // company admin & developer login

       userLogin(data:LoginRequest){
        return http.post<LoginResponse>('/auth/login',data)
       },
       getMe(){
            return http.get<{data:MeResponse}>('/auth/me')
       },
       refresh(){
        return http.post('/auth/refresh')
       },

       //password reset
       forgotPassword(email:string){
         return http.post ('/auth/forgot-password',{email})
       },
       
       verifyOtp(data:{email:string;otp:string}){
        return http.post ('/auth/verify-otp',data)
       },

       resetPassword(data:{
        email:string;
        otp:string;
        newPassword:string;
       }){
        return http.post('/auth/reset-password',data)
       },

       logout(){
        return http.post('/auth/logout')
       },
       signup(data:{name:string;email:string;password:string}){
        return http.post<{data:{email:string}}>('/auth/signup',data)
       },

       googleSignup(idToken:string){
        return http.post<{data:{email:string}}>('/auth/google/signup',{idToken})
       },

       verifySignupOtp(data:{email:string;otp:string}){
        return http.post('/auth/verify-signup-otp',data)
       },
       googleLogin(idToken:string){
        return http.post ('/auth/google/login',{idToken})
       }


        
}