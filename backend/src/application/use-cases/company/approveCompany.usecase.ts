import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class ApproveCompanyUseCase {
    constructor(
        private _companyRepo: ICompanyRepository
    ) { }

    async execute(companyId: string, superAdminId: string): Promise<void> {
        const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (company.status !== 'PENDING') {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_PENDING,HttpStatus.BAD_REQUEST)
        }

        await this._companyRepo.updateStatus(company.id, 'APPROVED', superAdminId)
    }
}