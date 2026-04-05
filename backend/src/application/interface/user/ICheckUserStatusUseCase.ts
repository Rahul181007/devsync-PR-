export interface ICheckUserStatusUseCase {
  execute(userId: string): Promise<void>;
}