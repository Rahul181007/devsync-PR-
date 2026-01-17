import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IGoogleAuthService } from "../../../domain/service/google-auth.service";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class GoogleSignupUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _googleAuthServices: IGoogleAuthService,
        private _emailService:IMailService
    ) { }
    async execute(idToken: string): Promise<{email:string}> {
        const googleUser = await this._googleAuthServices.verifyIdToken(idToken)

        if (!googleUser.emailVerified) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.EMAIL_NOT_VERIFIED, HttpStatus.UNAUTHORIZED)
        }
        const existingUser = await this._userRepo.findByEmail(googleUser.email)
        if (existingUser) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_ALREADY_EXISTS, HttpStatus.CONFLICT)
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this._userRepo.create({
            name: googleUser.name,
            email: googleUser.email,
            passwordHash: null,
            role: 'COMPANY_ADMIN',
            authProvider: 'GOOGLE',
            status: 'PENDING_VERIFICATION',
            companyId: null,
            otp,
            otpExpiresAt
        })
        await this._emailService.sendSignupOtp(googleUser.email,otp)
        return{
            email:googleUser.email
        }
    }
}
