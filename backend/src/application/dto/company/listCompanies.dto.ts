import { CompanyStatus } from "../../../domain/entities/company.entity";
export interface ListCompaniesQuery{
  page:number;
  limit:number;
  status?:CompanyStatus;
  search?:string
}