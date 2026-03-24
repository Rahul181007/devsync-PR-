import { IPasswordResetRepository } from "../../../domain/repositories/passwordReset.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IVerifyOtpForAuthenticatedUserUseCase } from "../../interface/auth/IVerifyOtpForAuthenticatedUserUseCase";

export class VerifyOtpForAuthenticatedUserUseCase implements IVerifyOtpForAuthenticatedUserUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _superAdminRepo: ISuperAdminRepository,
        private _passwordRepo: IPasswordResetRepository
    ) { }

    async execute(userId: string, otp: string): Promise<{ message: string; }> {
        let email: string;

        const user = await this._userRepo.findById(userId);

        if (user) {
            email = user.email
        } else {
            const superAdmin = await this._superAdminRepo.findById(userId);

            if (!superAdmin) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                );
            }
            email = superAdmin.email

        }

        const record = await this._passwordRepo.findValidOtp(email, otp);

        if (!record) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.INVALID_OTP,
                HttpStatus.BAD_REQUEST
            );
        }
        return {
            message:RESPONSE_MESSAGES.AUTH.OTP_VERIFIED
        }
    }
}