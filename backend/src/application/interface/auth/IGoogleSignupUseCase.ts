export interface IGoogleSignupUseCase {
  execute(idToken: string): Promise<{
    email: string;
  }>;
}
