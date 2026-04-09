import type { Company } from "./company.type"; 

export interface GetCompaniesResponse {
  items: Company[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}