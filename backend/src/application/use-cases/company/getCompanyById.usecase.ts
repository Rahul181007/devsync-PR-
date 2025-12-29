import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { AppError } from "../../../shared/errors/AppError";

export class GetCompanyIdUseCase{
    constructor(
       private companyRepo:ICompanyRepository,
       private userRepo:IUserRepository
    ){}

    async execute(companyId:string){
        const company=await this.companyRepo.findById(companyId);
        if(!company){
            throw new AppError('Company Not found',404);
        }
        let admin=undefined;
        if(company.ownerAdminId){
            const user=await this.userRepo.findById(company.ownerAdminId);
            if(user){
                admin={
                    id:user.id,
                    email:user.email,
                    status:user.status
                }
            }
        }
        
        return {
            ...company,
            admin
        }
    }
}