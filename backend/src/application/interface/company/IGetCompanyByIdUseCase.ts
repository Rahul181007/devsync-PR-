import { GetCompanyByIdResponse } from "../../dto/company/getCompanyByIdResponse.dto";

export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<GetCompanyByIdResponse>;
}