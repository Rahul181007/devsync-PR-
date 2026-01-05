import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { LoginDTO } from "../../dto/auth/login.dto";
import bcrypt from 'bcrypt';
import { LoginResponseDTO } from "../../dto/auth/login.response.dto";
import { Tokenutilits } from "../../../shared/utils/token.util";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";

export class LoginSuperAdminUseCase {
    constructor(private superAdminRepo: ISuperAdminRepository) { }

    async execute(data: LoginDTO): Promise<LoginResponseDTO> {

        const superAdmin = await this.superAdminRepo.findByEmail(data.email);
        if (!superAdmin) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            superAdmin.passwordHash
        )

        if (!isPasswordValid) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED);
        }

        // update last login time stamp
        await this.superAdminRepo.updateLastLogin(superAdmin.id, new Date())

        // prepare jwt payload
        const payload = {
            sub: superAdmin.id,
            role: superAdmin.role
        }

        // generate tokens
        const accessToken = Tokenutilits.generateAccessToken(payload);
        const refreshToken = Tokenutilits.generateRefreshToken({ sub: superAdmin.id, role: superAdmin.role })
        // return clean data not whole entity
        return {
            id: superAdmin.id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: superAdmin.role,
            accessToken,
            refreshToken
        }
    }

}