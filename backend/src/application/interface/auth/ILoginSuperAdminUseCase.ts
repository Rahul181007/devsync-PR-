import { LoginDTO } from "../../dto/auth/login.dto";
import { LoginResponseDTO } from "../../dto/auth/login.response.dto";

export interface ILoginSuperAdminUseCase {
  execute(data: LoginDTO): Promise<LoginResponseDTO>;
}