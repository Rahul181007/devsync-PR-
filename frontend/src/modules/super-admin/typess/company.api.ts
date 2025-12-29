import type { Company } from "./company.type"; 

export interface GetCompaniesResponse {
  items: Company[];
  total: number;
  limit:number;
}