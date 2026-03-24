export interface IVerifyOtpForAuthenticatedUserUseCase {
  execute(userId: string, otp: string): Promise<{
    message: string;
  }>;
}