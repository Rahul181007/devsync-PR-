import { CreateCompanyInput } from "../../dto/company/createCompany.dto";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";


export class CreateCompanyUseCase{
    constructor(
        private companyRepo:ICompanyRepository,
    ){}
    // local created we will replace it as utility function after the if we want to re use it
     private generateSlug(name:string):string{
            return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g,"")
            .replace(/\s+/g,"-")
        }

    async execute(input:CreateCompanyInput){
       const normalizedName = input.name.trim().toLowerCase();
        const normalizedDomain = input.domain? input.domain.trim().toLowerCase(): undefined;
       const company =await this.companyRepo.findByName(normalizedName)
       if(company){
        throw new AppError('company already exist ',409)
       }

     if (normalizedDomain) {
        const domain = await this.companyRepo.findByDomain(normalizedDomain);
       if (domain) {
        throw new AppError("domain already exist", 409);
       }
      }
       const slug= this.generateSlug(input.name)
       
       const newCompany=await this.companyRepo.create({
        name:input.name,
        slug,
        domain:normalizedDomain,
        createdBy:'superadmin',
        approvedBy:input.createdBySuperAdminId,
        status:'APPROVED'
       })
       return newCompany
    }
}