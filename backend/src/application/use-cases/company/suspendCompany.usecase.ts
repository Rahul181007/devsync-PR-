import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";

export class SuspendCompanyUseCase{
    constructor(
        private companyRepo:ICompanyRepository
    ){}

    async execute(companyId:string):Promise<void>{
        const company=await this.companyRepo.findById(companyId);
        if(!company){
            throw new AppError('company not found',404)
        }
        if(company.status==='PENDING' || company.status==='SUSPENDED'){
            throw new AppError('Company cannot be suspended',400)
        }
        await this.companyRepo.updateStatus(company.id,'SUSPENDED')
    }
}