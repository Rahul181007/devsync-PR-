import { Request, Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginUserUseCase } from "../../application/use-cases/auth/loginUser.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshToken.usecase";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { userCookieOptions } from "../../config/userCookieOptions";
import { signupSchema } from "../../application/validators/auth/signup.validator";
import { SignupUseCase } from "../../application/use-cases/auth/signup.usecase";


export class UserAuthController {
    constructor(private loginUserUseCase: LoginUserUseCase, private refreshTokenUseCase: RefreshTokenUseCase,
        private signupUseCase: SignupUseCase
    ) { }

    login = async (req: Request, res: Response) => {
        try {

            const parsed = loginSchema.parse(req.body);
            logger.info(`User login attempted ${parsed.email}`);
            const result = await this.loginUserUseCase.execute(parsed);

            logger.info(`user login successful ${result.email}`)

            if (result.requiresOnboarding) {
                return res.status(HttpStatus.OK).json({
                    message: RESPONSE_MESSAGES.AUTH.ONBOARDING_REQUIRED,
                    requiresOnboarding: true,
                    data: {
                        id: result.id,
                        email: result.email,
                        role: result.role
                    }
                })
            }


            if (result.waitingForApproval) {
                return res.status(HttpStatus.OK).json({
                    message: RESPONSE_MESSAGES.AUTH.WAITING_FOR_APPROVAL,
                    waitingForApproval: true,
                    data: {
                        id: result.id,
                        email: result.email,
                        role: result.role
                    }
                })
            }
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
                message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
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

    signup = async (req: Request, res: Response) => {
        try {
            logger.info(`User signup attempted ${req.body.email}`);

            const parsed = signupSchema.parse(req.body);
            await this.signupUseCase.execute(parsed);

            logger.info(`User signup successful ${parsed.email}`);

            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.AUTH.USER_CREATED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

}