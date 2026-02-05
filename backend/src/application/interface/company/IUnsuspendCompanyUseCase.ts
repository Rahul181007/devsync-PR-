export interface IUnsuspendCompanyUseCase {
  execute(companyId: string): Promise<void>;
}
