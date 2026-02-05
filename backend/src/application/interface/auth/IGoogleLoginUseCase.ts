import { LoginResponseDTO } from "../../dto/auth/login.response.dto";

export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<LoginResponseDTO>;
}