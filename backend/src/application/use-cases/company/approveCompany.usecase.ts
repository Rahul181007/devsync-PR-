import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";

export class ApproveCompanyUseCase {
    constructor(
        private companyRepo: ICompanyRepository
    ) { }

    async execute(companyId: string, superAdminId: string): Promise<void> {
        const company = await this.companyRepo.findById(companyId);
        if (!company) {
            throw new AppError('company not found', 404)
        }
        if (company.status !== 'PENDING') {
            throw new AppError('Company is not in pending state', 400)
        }

        await this.companyRepo.updateStatus(company.id, 'APPROVED', superAdminId)
    }
}