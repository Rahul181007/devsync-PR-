import { env } from "../../../config/env";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { InviteTokenUtil } from "../../../shared/utils/inviteToken.util";
import { InviteDeveloperInput } from "../../dto/invite/InviteDeveloperInput.dto";

interface InviterContext {
    id: string;
    role: 'COMPANY_ADMIN';
    companyId: string
}

export class InviteDeveloperUseCase {
    constructor(
        private inviteRepo: IInviteRepository,
        private mailService: IMailService,
        private companyRepo: ICompanyRepository
    ) { }

    async execute(input: InviteDeveloperInput, inviter: InviterContext) {
        if (inviter.role !== 'COMPANY_ADMIN') {
            throw new AppError(RESPONSE_MESSAGES.INVITE.ONLY_COMPANY_ADMIN, HttpStatus.FORBIDDEN)
        }

        const company = await this.companyRepo.findById(inviter.companyId);
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const existingInvite = await this.inviteRepo.findPendingByEmailAndCompany(input.email, inviter.companyId);
        const token = InviteTokenUtil.generateToken();
        const expiresAt = InviteTokenUtil.generateExpiry();

        if (existingInvite) {
            const updated = await this.inviteRepo.updateInvite(
                existingInvite.id,
                token,
                expiresAt
            );

            if (!updated) {
                throw new AppError(
                    RESPONSE_MESSAGES.INVITE.CREATE_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            const inviteLink = `${env.FRONTEND_URL}/accept-invite?token=${token}`

            await this.mailService.sendDeveloperInviteEmail({ to: updated.email, inviteLink, companyName: company.name });

            return {
                id: updated.id,
                email: updated.email,
                expiresAt: updated.expiresAt
            }
        }

        const invite = await this.inviteRepo.create({
            email: input.email,
            companyId: inviter.companyId,
            role: 'DEVELOPER',
            invitedBy: inviter.id,
            token,
            expiresAt
        })

        if (!invite) {
            throw new AppError(RESPONSE_MESSAGES.INVITE.CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        const inviteLink = `${env.FRONTEND_URL}/accept-invite?token=${token}`

        await this.mailService.sendDeveloperInviteEmail({
            to: invite.email,
            inviteLink,
            companyName: company.name
        })

        return {
            id: invite.id,
            email: invite.email,
            expiresAt: invite.expiresAt
        }
    }
}