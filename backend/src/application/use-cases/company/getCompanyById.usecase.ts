import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class GetCompanyIdUseCase {
    constructor(
        private companyRepo: ICompanyRepository,
        private userRepo: IUserRepository,
        private inviteRepo: IInviteRepository
    ) { }

    async execute(companyId: string) {
        const company = await this.companyRepo.findById(companyId);
        console.log(company)
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND);
        }
        let admin = undefined;
        if (company.ownerAdminId) {
            const user = await this.userRepo.findById(company.ownerAdminId);
            if (user) {
                admin = {
                    id: user.id,
                    email: user.email,
                    status: user.status
                }
            }
        }
        const hasPendingInvite =
            !company.ownerAdminId &&
            (await this.inviteRepo.hasPendingInviteForCompany(company.id));

        return {
            id: company.id,
            name: company.name,
            slug: company.slug,
            status: company.status,
            domain: company.domain,
            ownerAdminId: company.ownerAdminId,
            adminEmail: company.adminEmail,
            hasPendingInvite,
            admin
        }
    }
}