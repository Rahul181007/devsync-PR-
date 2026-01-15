import crypto from 'crypto';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IPasswordResetRepository } from '../../../domain/repositories/passwordReset.repository';
import { IMailService } from '../../../domain/service/mail.service';
import { AppError } from '../../../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessages';
import { HttpStatus } from '../../../shared/constants/httpStatus';

export class SendOtpUseCase{
    constructor(
        private _useRepo:IUserRepository,
        private _passwordRepo:IPasswordResetRepository,
        private _mailService:IMailService
    ){}

    async execute(email:string){
        const normalisedEmail=email.trim().toLowerCase()

        const user=await this._useRepo.findByEmail(normalisedEmail);

        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }

        // generate otp
        const otp=crypto.randomInt(100000, 999999).toString();

        // otp expires in 5 minutes
        const expiresAt=new Date(Date.now()+5*60*1000)

        // remove old Otps
        await this._passwordRepo.deleteByEmail(email);

        //save new OTP
        await this._passwordRepo.create({
            email,
            otp,
            expiresAt
        })
        await this._mailService.sendOtp(email,otp)
        console.log(`OTP for ${email}: ${otp}`); // Later replace with email service

         return { message: RESPONSE_MESSAGES.AUTH.OTP_SENT_SUCCESS };
    }
}