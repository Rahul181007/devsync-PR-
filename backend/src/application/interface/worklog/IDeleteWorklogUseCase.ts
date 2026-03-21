export interface IDeleteWorklogUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    worklogId: string
  ): Promise<void>;
}