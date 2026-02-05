import { UpdateCompanyBrandingInput } from "../../dto/company/updateBranding.dto";

export interface IUpdateCompanyBrandingUseCase {
  execute(
    companyId: string,
    data: UpdateCompanyBrandingInput
  ): Promise<void>;
}