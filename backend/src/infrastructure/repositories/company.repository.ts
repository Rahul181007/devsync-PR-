import { ICompanyRepository } from "../../domain/repositories/company.repository";
import { CreateCompanyData } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company.entity";
import { CompanyModel } from "../db/models/Company.models";
import { ICompanyDocument } from "../db/models/Company.models";


export class CompanyRepository implements ICompanyRepository{
   private toEntity(companyDoc:ICompanyDocument):Company{ // mapper
    return new Company(
        companyDoc._id.toString(),
        companyDoc.name,
        companyDoc.slug,
        companyDoc.ownerAdminId?.toString()??"",
        companyDoc.status,
        companyDoc.createdBy,
        companyDoc.domain??undefined,
        companyDoc.approvedBy?.toString()??undefined,
        companyDoc.themeColor??undefined,
        companyDoc.currentPlanId?.toString()??undefined,
        companyDoc.subscriptionId?.toString()??undefined
    )
   }
   async findByName(name: string): Promise<Company | null> {
       const companyDoc=await CompanyModel.findOne({name})
       if(!companyDoc){
        return null
       }
       return this.toEntity(companyDoc)
   }

   async findByDomain(domain: string): Promise<Company | null> {
       const companyDoc=await CompanyModel.findOne({domain:domain})
       if(!companyDoc) return null;
       return this.toEntity(companyDoc)
   }

   async create(data: CreateCompanyData): Promise<Company> {
       const doc=await CompanyModel.create(data)
       return this.toEntity(doc)
   }
}