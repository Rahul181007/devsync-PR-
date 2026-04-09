import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { ICheckUserStatusUseCase } from "../../interface/user/ICheckUserStatusUseCase";

export class CheckUserStatusUseCase implements ICheckUserStatusUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _superAdminRepo: ISuperAdminRepository
    ) { }

    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            const superAdmin = await this._superAdminRepo.findById(userId);

            if (!superAdmin) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                );
            }
            return;
        }
        if (user.status === "BLOCKED") {
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_BLOCKED, HttpStatus.FORBIDDEN)
        }
    }
}