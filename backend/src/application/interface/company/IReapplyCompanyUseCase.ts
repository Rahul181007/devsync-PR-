export interface IReapplyCompanyUseCase {
  execute(companyId: string): Promise<void>;
}
