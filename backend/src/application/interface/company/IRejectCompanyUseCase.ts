import { RejectCompanyInput } from "../../dto/company/rejectCompany.dto";


export interface IRejectCompanyUseCase {
  execute(input: RejectCompanyInput): Promise<void>;
}
