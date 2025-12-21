import { Request, Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginUserUseCase } from "../../application/use-cases/auth/loginUser.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshToken.usecase";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";
import { superAdminCookieOptions } from "../../config/superAdminCookieOption";


export class UseAuthController {
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
                superAdminCookieOptions
            )
            return res.json({
                message: 'Login successful',
                data: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    role: result.role,
                },
                accessToken: result.accessToken
            })
        } catch (error: unknown) {
            return handleError(error, res, 400, 'user login failed')
        }
    }

}