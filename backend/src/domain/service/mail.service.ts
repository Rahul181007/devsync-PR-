export interface IMailService{
    sendOtp(email:string,otp:string):Promise<void>
    sendCompanyAdminInviteEmail(data:{
        to:string,
        inviteLink:string
    }):Promise<void>
}