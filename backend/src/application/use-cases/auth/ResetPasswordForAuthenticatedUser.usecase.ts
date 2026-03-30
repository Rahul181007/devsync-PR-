import { IPasswordResetRepository } from "../../../domain/repositories/passwordReset.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IResetPasswordForAuthenticatedUserUseCase } from "../../interface/auth/IResetPasswordForAuthenticatedUserUseCase";
import bcrypt from "bcrypt";
export class ResetPasswordForAuthenticatedUserUseCase implements IResetPasswordForAuthenticatedUserUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _superAdminRepo: ISuperAdminRepository,
        private _passwordRepo: IPasswordResetRepository
    ) { }

    async execute(userId: string, newPassword: string): Promise<{ message: string; }> {
        let email: string;

        const user = await this._userRepo.findById(userId);

        if (user) {
            email = user.email;
        } else {
            const superAdmin = await this._superAdminRepo.findById(userId);

            if (!superAdmin) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                );
            }

        email=superAdmin.email
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);

        if(user){
            await this._userRepo.updatePassword(userId,hashedPassword);

        }else{
            await this._superAdminRepo.updatePassword(userId,hashedPassword);

        }
        await this._passwordRepo.deleteByEmail(email);
        return {
            message:RESPONSE_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS
        }
    }
}