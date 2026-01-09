import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { CreateWorkspaceDTO } from "../../dto/company/createWorkspace.dto";

export class CreateWorkspaceUseCase {
    constructor(
        private companyRepo: ICompanyRepository,
        private userRepo: IUserRepository
    ) { }

    private _generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
    }

    async execute(userId: string, data: CreateWorkspaceDTO) {
        const normalizedName = data.name.trim();
        const normalizedDomain = data.domain
            ? data.domain.trim().toLowerCase()
            : undefined;

        const user = await this.userRepo.findById(userId)
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (user.role !== 'COMPANY_ADMIN') {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        if (user.status !== 'PENDING_ONBOARDING') {
            throw new AppError(RESPONSE_MESSAGES.AUTH.WORKSPACE_CREATION_NOT_ALLOWED, HttpStatus.FORBIDDEN);
        }

        if (user.companyId !== null) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.WORKSPACE_ALREADY_EXISTS, HttpStatus.FORBIDDEN)
        }

        const slug = this._generateSlug(data.name)

        const newCompany = await this.companyRepo.create({
            name: normalizedName,
            domain: normalizedDomain,
            slug,
            createdBy: 'self',
            adminEmail: user.email,
            status: 'PENDING',
             onboardingStep: 'BRANDING',
            ownerAdminId: user.id,
        })
        await this.userRepo.assignCompany(user.id, newCompany.id)
        await this.userRepo.updateStatus(user.id,"ACTIVE")

        return {
            userId:user.id,
            companyId:newCompany.id,
            role:user.role
        }
    }
}