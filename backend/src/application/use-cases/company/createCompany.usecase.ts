import { IUserRepository } from "../../../domain/repositories/user.repository";
import { CreateCompanyInput } from "../../dto/company/createCompany.dto";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";


export class CreateCompanyUseCase{
    constructor(
        private companyRepo:ICompanyRepository,
        private userRepo:IUserRepository,

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

       const company =await this.companyRepo.findByName(normalizedName)
       if(company){
        throw new AppError('company already exist ',409)
       }

     if (typeof input.domain === "string") {
        const domain = await this.companyRepo.findByDomain(input.domain);
       if (domain) {
        throw new AppError("domain already exist", 409);
       }
      }


       const user=await this.userRepo.findById(input.ownerAdminId);
       if(!user){
        throw new AppError('Admin not found',404)
       }
       if(user?.role!=='COMPANY_ADMIN'){
        throw new AppError('user is not an company admin ',404)
       }
       if(user.companyId){
        throw new AppError('user already assigned to the company',409)
       }
       const slug= this.generateSlug(input.name)
       
       const newCompany=await this.companyRepo.create({
        name:input.name,
        slug,
        domain:input.domain,
        ownerAdminId:input.ownerAdminId,
        createdBy:'superadmin',
        approvedBy:input.createdBySuperAdminId,
        status:'APPROVED'
       })

       await this.userRepo.assignCompany( input.ownerAdminId,newCompany.id);

       return newCompany
    }
}