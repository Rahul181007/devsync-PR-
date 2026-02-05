import { ListCompaniesQuery } from "../../dto/company/listCompanies.dto";
import { ListCompaniesResponse } from "../../dto/company/listCompaniesResponse.dto";

export interface IListCompaniesUseCase {
  execute(query: ListCompaniesQuery): Promise<ListCompaniesResponse>;
}