import { CreateCompanyInput } from "../../dto/company/createCompany.dto";
import { CreateCompanyResponse } from "../../dto/company/createCompanyResponse.dto";
export interface ICreateCompanyUseCase {
  execute(input: CreateCompanyInput): Promise<CreateCompanyResponse>;
}