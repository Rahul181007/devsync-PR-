import { LoginDTO } from "../../dto/auth/login.dto";
import { LoginResponseDTO } from "../../dto/auth/login.response.dto";

export interface ILoginUserUseCase {
  execute(data: LoginDTO): Promise<LoginResponseDTO>;
}