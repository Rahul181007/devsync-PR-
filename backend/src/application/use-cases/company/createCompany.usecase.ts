import { CreateCompanyInput } from "../../dto/company/createCompany.dto";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { HttpStatus } from "../../../shared/constants/httpStatus";


export class CreateCompanyUseCase{
    constructor(
        private companyRepo:ICompanyRepository,
    ){}
    // local created we will replace it as utility function after the if we want to re use it
     private _generateSlug(name:string):string{
            return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g,"")
            .replace(/\s+/g,"-")
        }

    async execute(input:CreateCompanyInput){
       const normalizedName = input.name.trim().toLowerCase();
        const normalizedDomain = input.domain? input.domain.trim().toLowerCase(): undefined;
        const normalizedAdminEmail=input.adminEmail? input.adminEmail.trim().toLowerCase():undefined;
       const company =await this.companyRepo.findByName(normalizedName)
       if(company){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.ALREADY_EXISTS,HttpStatus.CONFLICT)
       }

     if (normalizedDomain) {
        const domain = await this.companyRepo.findByDomain(normalizedDomain);
       if (domain) {
        throw new AppError(RESPONSE_MESSAGES.COMPANY.DOMAIN_ALREADY_EXISTS, HttpStatus.CONFLICT);
       }
      }
     if(normalizedAdminEmail){
       const isAdminMail=await this.companyRepo.findByEmail(normalizedAdminEmail)
       if(isAdminMail){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.ADMIN_EMAIL_ALREADY_EXISTS,HttpStatus.CONFLICT)
       }
     }
      
       const slug= this._generateSlug(input.name)
       
       const newCompany=await this.companyRepo.create({
        name:input.name,
        slug,
        domain:normalizedDomain,
        createdBy:'superadmin',
        approvedBy:input.createdBySuperAdminId,
        status:'APPROVED',
        onboardingStep:'BRANDING',
        adminEmail:normalizedAdminEmail??null
       })
       return newCompany
    }
}