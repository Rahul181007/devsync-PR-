import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { RejectCompanyInput } from "../../dto/company/rejectCompany.dto";
import { IRejectCompanyUseCase } from "../../interface/company/IRejectCompanyUseCase";

export class RejectCompanyUseCase implements IRejectCompanyUseCase{
    constructor(
      private _companyRepo:ICompanyRepository,
      private _userRepo:IUserRepository,
      private _notificationRepo:INotificationRepository
    ){}

    async execute(input: RejectCompanyInput):Promise<void>{
        const {companyId,rejectedBy,reason}=input

        if(!reason || reason.trim().length<5){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.REJECTION_REASON,HttpStatus.BAD_REQUEST)
        }

        const company=await this._companyRepo.findById(companyId);
        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(company.status!=='PENDING'){
            throw new AppError( `Company cannot be rejected when status is ${company.status}`,HttpStatus.FORBIDDEN)
        }

        company.status='REJECTED';
        company.rejectionReason=reason;
        company.reviewedAt=new Date();
        company.approvedBy=rejectedBy

        await this._companyRepo.save(company);

        const companyAdmin=await this._userRepo.findCompanyAdminByCompany(company.id);

     if (companyAdmin) {
    await this._notificationRepo.create({
        userId: companyAdmin.id,
        type: "COMPANY_REJECTED",
        title: "Company Rejected",
        message: `Your company "${company.name}" has been rejected. Reason: ${reason}`,
        metadata: {
            companyId: company.id
        }
    });
}
    }
}