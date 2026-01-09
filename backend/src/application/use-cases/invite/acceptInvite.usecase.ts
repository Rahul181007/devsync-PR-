import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IPasswordHasher } from "../../../domain/service/password-hasher";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { AcceptInviteInput } from "../../dto/invite/acceptInvite.dto";

export class AcceptInviteUseCase {
    constructor(
        private inviteRepo: IInviteRepository,
        private userRepo: IUserRepository,
        private companyRepo: ICompanyRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(input: AcceptInviteInput) {
        const invite = await this.inviteRepo.findByToken(input.token);
        if (!invite) {
            throw new AppError(RESPONSE_MESSAGES.INVITE.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
        }
        if (invite.status !== 'PENDING') {
            throw new AppError(RESPONSE_MESSAGES.INVITE.NOT_PENDING, HttpStatus.BAD_REQUEST);
        }
        if (invite.expiresAt.getTime() < Date.now()) {
            throw new AppError(RESPONSE_MESSAGES.INVITE.EXPIRED, HttpStatus.GONE)
        }

        const company = await this.companyRepo.findById(invite.companyId);
        if (!company) {
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }
        
        const hashPassword = await this.passwordHasher.hash(input.password);


        const user = await this.userRepo.create({
            email: invite.email,
            passwordHash: hashPassword,
            role: invite.role,
            status:'PENDING_ONBOARDING',
            companyId:invite.companyId
        })
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        await this.companyRepo.assignOwnerAdmin(invite.companyId, user.id)
        await this.inviteRepo.markAsAccepted(invite.id)
        return {
            userId: user.id,
            companyId: invite.companyId
        }
    }
}