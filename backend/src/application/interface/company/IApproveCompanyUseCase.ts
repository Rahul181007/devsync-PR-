export interface IApproveCompanyUseCase {
  execute(companyId: string, superAdminId: string): Promise<void>;
}
