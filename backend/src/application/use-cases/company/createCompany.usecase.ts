import { CreateCompanyInput } from "../../dto/company/createCompany.dto";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { AppError } from "../../../shared/errors/AppError";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { CreateCompanyResponse } from "../../dto/company/createCompanyResponse.dto";
import { ICreateCompanyUseCase } from "../../interface/company/ICreateCompanyUseCase";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";


export class CreateCompanyUseCase implements ICreateCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository,
        private _planRepo:IPlanRepository,
        private _subscriptionRepo:ISubscriptionRepository
    ){}
    // local created we will replace it as utility function after the if we want to re use it
     private _generateSlug(name:string):string{
            return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g,"")
            .replace(/\s+/g,"-")
        }

    async execute(input:CreateCompanyInput):Promise<CreateCompanyResponse>{
       const normalizedName = input.name.trim().toLowerCase();
        const normalizedDomain = input.domain? input.domain.trim().toLowerCase(): undefined;
        const normalizedAdminEmail=input.adminEmail? input.adminEmail.trim().toLowerCase():undefined;
       const company =await this._companyRepo.findByName(normalizedName)
       if(company){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.ALREADY_EXISTS,HttpStatus.CONFLICT)
       }

     if (normalizedDomain) {
        const domain = await this._companyRepo.findByDomain(normalizedDomain);
       if (domain) {
        throw new AppError(RESPONSE_MESSAGES.COMPANY.DOMAIN_ALREADY_EXISTS, HttpStatus.CONFLICT);
       }
      }
     if(normalizedAdminEmail){
       const isAdminMail=await this._companyRepo.findByEmail(normalizedAdminEmail)
       if(isAdminMail){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.ADMIN_EMAIL_ALREADY_EXISTS,HttpStatus.CONFLICT)
       }
     }
      
       const slug= this._generateSlug(input.name)
       
       const newCompany=await this._companyRepo.create({
        name:input.name,
        slug,
        domain:normalizedDomain,
        createdBy:'superadmin',
        approvedBy:input.createdBySuperAdminId,
        status:'APPROVED',
        onboardingStep:'BRANDING',
        adminEmail:normalizedAdminEmail??null
       })
       const freePlan=await this._planRepo.findDefaultPlan();
       if(!freePlan){
          throw new AppError(RESPONSE_MESSAGES.PLAN.NOT_FOUND,HttpStatus.NOT_FOUND);
       }

       const subscription=await this._subscriptionRepo.create({
        companyId:newCompany.id,
        planId:freePlan.id,
        status:"ACTIVE",
        billingCycle:"MONTHLY",
        startDate:new Date(),
        endDate:null,
        renewsAt:null
       })

       await this._companyRepo.updateSubscription(newCompany.id,{
        currentPlanId:freePlan.id,
        subscriptionId:subscription.id
       })
       return {
        id:newCompany.id,
        name:newCompany.name,
        slug:newCompany.slug,
        domain:newCompany.domain,
        status:newCompany.status,
        onboardingStep:newCompany.onboardingStep,
        adminEmail:newCompany.adminEmail
       }
    }
}