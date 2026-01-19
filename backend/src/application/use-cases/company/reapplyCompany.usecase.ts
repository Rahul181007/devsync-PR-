import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class ReapplyCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository
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
                `company cannot reapply when status is ${company.id}`,
                HttpStatus.FORBIDDEN
            )
        }

        company.status='PENDING';
        company.rejectionReason=undefined;
        company.reviewedAt=undefined;
        await this._companyRepo.save(company)

    }
}