import crypto from 'crypto';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IPasswordResetRepository } from '../../../domain/repositories/passwordReset.repository';

export class SendOtpUseCase{
    constructor(
        private useRepo:IUserRepository,
        private passwordRepo:IPasswordResetRepository
    ){}

    async execute(email:string){
        const user=await this.useRepo.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }

        // generate otp
        const otp=crypto.randomInt(100000, 999999).toString();

        // otp expires in 5 minutes
        const expiresAt=new Date(Date.now()+5*60*1000)

        // remove old Otps
        await this.passwordRepo.deleteByEmail(email);

        //save new OTP
        await this.passwordRepo.create({
            email,
            otp,
            expiresAt
        })

        console.log(`OTP for ${email}: ${otp}`); // Later replace with email service

         return { message: "OTP sent successfully" };
    }
}