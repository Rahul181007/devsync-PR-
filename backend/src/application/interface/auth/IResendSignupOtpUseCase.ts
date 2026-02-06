export interface IResendSignupOtpUseCase{
    execute(email:string):Promise<void>
}