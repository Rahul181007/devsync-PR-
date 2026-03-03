import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IReapplyCompanyUseCase } from "../../interface/company/IReapplyCompanyUseCase";

export class ReapplyCompanyUseCase implements IReapplyCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository,
            private _superAdminRepo: ISuperAdminRepository,
    private _notificationRepo: INotificationRepository
    ){}

    async execute(companyId:string):Promise<void>{
        const company=await this._companyRepo.findById(companyId);
       
        if(!company){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(company.status!=='REJECTED'){
            throw new AppError(
                `company cannot reapply when status is ${company.status}`,
                HttpStatus.FORBIDDEN
            )
        }

        company.status='PENDING';
        company.rejectionReason=undefined;
        company.reviewedAt=undefined;
        await this._companyRepo.save(company)
            const superAdmin = await this._superAdminRepo.findActive();

    if (superAdmin) {
        await this._notificationRepo.create({
            userId: superAdmin.id,
            type: "COMPANY_REAPPLIED",
            title: "Company Reapplied for Approval",
            message: `Company "${company.name}" has reapplied for approval.`,
            metadata: {
                companyId: company.id
            }
        });
    }
    }
}