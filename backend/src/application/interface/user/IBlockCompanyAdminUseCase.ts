export interface IBlockCompanyAdminUseCase {
  execute(targetUserId: string): Promise<void>;
}
