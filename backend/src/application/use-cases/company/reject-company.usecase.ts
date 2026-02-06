import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { RejectCompanyInput } from "../../dto/company/rejectCompany.dto";
import { IRejectCompanyUseCase } from "../../interface/company/IRejectCompanyUseCase";

export class RejectCompanyUseCase implements IRejectCompanyUseCase{
    constructor(
      private _companyRepo:ICompanyRepository
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

        await this._companyRepo.save(company)
    }
}