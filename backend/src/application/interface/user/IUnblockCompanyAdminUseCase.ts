export interface IUnblockCompanyAdminUseCase {
  execute(targetUserId: string): Promise<void>;
}
