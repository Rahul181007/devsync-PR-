import { SignupDTO } from "../../dto/auth/signup.dto";

export interface ISignupUseCase {
  execute(
    data: SignupDTO
  ): Promise<{
    email: string;
  }>;
}