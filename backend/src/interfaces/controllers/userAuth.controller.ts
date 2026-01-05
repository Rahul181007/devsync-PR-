import { Request, Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginUserUseCase } from "../../application/use-cases/auth/loginUser.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshToken.usecase";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { userCookieOptions } from "../../config/userCookieOptions";


export class UserAuthController {
    constructor(private loginUserUseCase: LoginUserUseCase, private refreshTokenUseCase: RefreshTokenUseCase) { }

    login = async (req: Request, res: Response) => {
        try {
            logger.info(`User login attempted ${req.body.email}`)
            const parsed = loginSchema.parse(req.body);

            const result = await this.loginUserUseCase.execute(parsed);

            logger.info(`user login successful ${result.email}`)
            
            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/",
            })


            res.cookie(
                'refresh_token',
                result.refreshToken,
                userCookieOptions
            )
            return res.status(HttpStatus.OK).json({
                message:RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
                data: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    role: result.role,
                },
                accessToken: result.accessToken
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

}