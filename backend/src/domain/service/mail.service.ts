export interface IMailService{
    sendOtp(email:string,otp:string):Promise<void>
    sendCompanyAdminInviteEmail(data:{
        to:string,
        inviteLink:string
    }):Promise<void>

    sendDeveloperInviteEmail(data:{
        to:string,
        inviteLink:string,
        companyName:string,
    }):Promise<void>

    sendSignupOtp(email: string, otp: string): Promise<void>;
}