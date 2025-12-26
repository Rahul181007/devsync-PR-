import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IPasswordHasher } from "../../../domain/service/password-hasher";
import { AppError } from "../../../shared/errors/AppError";
import { AcceptInviteInput } from "../../dto/invite/acceptInvite.dto";

export class AcceptInviteUseCase {
    constructor(
        private inviteRepo: IInviteRepository,
        private userRepo: IUserRepository,
        private companyRepo: ICompanyRepository,
        private passwordHasher:IPasswordHasher
    ) { }

    async execute(input:AcceptInviteInput) {
        const invite = await this.inviteRepo.findByToken(input.token);
        if (!invite) {
            throw new AppError('Invalid invite token', 400);
        }
        if (invite.status !== 'PENDING') {
            throw new AppError('Invite already used or expired');
        }
        if (invite.expiresAt.getTime() < Date.now()) {
            throw new AppError('Invite has expired')
        }
        const hashPassword=await this.passwordHasher.hash(input.password);
       
            const user = await this.userRepo.create({
                email: invite.email,
                passwordHash: hashPassword,
                role: invite.role
            })
            if (!user) {
                throw new AppError('user was not created')
            }
            await this.userRepo.assignCompany(user.id, invite.companyId)
            await this.companyRepo.assignOwnerAdmin(invite.companyId,user.id)
            await this.inviteRepo.markAsAccepted(invite.id)
        return {
            userId:user.id,
            companyId:invite.companyId
        }
    }
}