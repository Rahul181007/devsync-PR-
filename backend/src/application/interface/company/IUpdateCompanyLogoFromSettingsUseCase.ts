import { UpdateCompanyLogoFromSettingsDTO } from "../../dto/company/updateCompanyLogoFromSettings.dto";

export interface IUpdateCompanyLogoFromSettingsUseCase {
  execute(
    data: UpdateCompanyLogoFromSettingsDTO
  ): Promise<{
    message: string;
  }>;
}