import { ICompanyRepository, ListCompaniesQuery } from "../../domain/repositories/company.repository";
import { CreateCompanyData } from "../../domain/repositories/company.repository";
import { Company, CompanyStatus } from "../../domain/entities/company.entity";
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

   async findAll(query: ListCompaniesQuery): Promise<{ items: Company[]; total: number; }> {
       const {page,limit,status,search}=query;
       const filter:Record<string,unknown>={}
       if(status){
        filter.status=status
       }
       if(search){
        filter.$or=[{name:{$regex:search,$options:'i'}},{domain:{$regex:search,$options:'i'}}]
       }
       const items=await CompanyModel.find(filter).skip((page-1)*limit).limit(limit).sort({createdAt:-1})
       const total=await CompanyModel.countDocuments(filter)
       
       return{
        items:items.map(val=>this.toEntity(val)),
        total
       }
   }

   async updateStatus(companyId: string, status: CompanyStatus, approvedBy?: string): Promise<void> {
       const update:Record<string,unknown>={status};
       if(approvedBy){
        update.approvedBy=approvedBy
       } 
       await CompanyModel.findByIdAndUpdate(companyId,update)
   }

   async findById(companyId: string): Promise<Company | null> {
       const company =await CompanyModel.findById(companyId);
       if(!company){
        return null
       }else{
        return this.toEntity(company)
       }
   }
}