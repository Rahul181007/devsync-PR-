export interface ISendOtpForAuthenticatedUserUseCase {
  execute(userId: string): Promise<{
    message: string;
  }>;
}