import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class SuspendCompanyUseCase{
    constructor(
        private companyRepo:ICompanyRepository
    ){}

    async execute(companyId:string):Promise<void>{
        const company=await this.companyRepo.findById(companyId);
        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(company.status==='PENDING' || company.status==='SUSPENDED'){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.COMPANY_NOT_SUSPENDED,HttpStatus.BAD_REQUEST)
        }
        await this.companyRepo.updateStatus(company.id,'SUSPENDED')
    }
}