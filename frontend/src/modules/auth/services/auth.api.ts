import { http } from "../../../core/api/http";

export interface LoginRequest{
    email:string;
    password:string;
}

export interface LoginResponse {
    message:string
    data:{
        id:string;
        name:string;
        email:string;
        role:'SUPER_ADMIN'|'COMPANY_ADMIN'|'DEVELOPER'
        companyId?:string
    },
    accessToken:string;
}

export const authApi={
       superAdminLogin(data:LoginRequest){
        return http.post<LoginResponse>('/auth/superadmin/login',data)
       },

       superAdminRefresh(){
        return http.post ('/auth/superadmin/refresh')
       },

       // company admin & developer login

       userLogin(data:LoginRequest){
        return http.post<LoginResponse>('/auth/login',data)
       },

       userRefresh(){
        return http.post('/auth/refresh');
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
       }

}