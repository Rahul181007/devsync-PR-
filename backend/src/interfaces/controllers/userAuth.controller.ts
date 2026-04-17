import { Request, Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";

import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";

import { signupSchema } from "../../application/validators/auth/signup.validator";
import { IGoogleLoginUseCase } from "../../application/interface/auth/IGoogleLoginUseCase";
import { IGoogleSignupUseCase } from "../../application/interface/auth/IGoogleSignupUseCase";
import { ILoginUserUseCase } from "../../application/interface/auth/ILoginUserUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/auth/IRefreshTokenUseCase";
import { ISignupUseCase } from "../../application/interface/auth/ISignupUseCase";
import { IVerifySignupOtpUseCase } from "../../application/interface/auth/IVerifySignupOtpUseCase";
import { IResendSignupOtpUseCase } from "../../application/interface/auth/IResendSignupOtpUseCase";
import { cookieOptions } from "../../config/cookieOptions";



export class UserAuthController {
    constructor(
        private _loginUserUseCase: ILoginUserUseCase,
        private _refreshTokenUseCase: IRefreshTokenUseCase,
        private _signupUseCase: ISignupUseCase,
        private _googleSignupUseCase: IGoogleSignupUseCase,
        private _verifySignupOtpUseCase: IVerifySignupOtpUseCase,
        private _googleLoginUseCase: IGoogleLoginUseCase,
        private _resendSignupOtpUseCase: IResendSignupOtpUseCase

    ) { }

    login = async (req: Request, res: Response) => {
        try {
            const parsed = loginSchema.parse(req.body);

            logger.info(`User1 login attempted ${parsed.email}`);
            const result = await this._loginUserUseCase.execute(parsed);

            logger.info(`user login successful ${result.email}`)

            if (result.requiresOnboarding) {
                res.cookie("accessToken", result.accessToken, cookieOptions);
                res.cookie("refresh_token", result.refreshToken, {
                    ...cookieOptions,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.status(HttpStatus.OK).json({
                    message: RESPONSE_MESSAGES.AUTH.ONBOARDING_REQUIRED,
                    data: result
                });

            }


            if (result.waitingForApproval) {
                res.cookie("accessToken", result.accessToken, cookieOptions);
                res.cookie("refresh_token", result.refreshToken, {
                    ...cookieOptions,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.status(HttpStatus.OK).json({
                    message: RESPONSE_MESSAGES.AUTH.ONBOARDING_REQUIRED,
                    data: result
                });

            }
            res.cookie("accessToken", result.accessToken, cookieOptions);
            res.cookie("refresh_token", result.refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
                data: result
            });

        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    signup = async (req: Request, res: Response) => {
        try {
            logger.info(`User signup attempted ${req.body.email}`);

            const parsed = signupSchema.parse(req.body);
            const result = await this._signupUseCase.execute(parsed);

            logger.info(`User signup successful ${parsed.email}`);

            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.AUTH.USER_CREATED,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
    googleSignupUseCase = async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;
            const result = await this._googleSignupUseCase.execute(idToken)
            res.status(HttpStatus.OK).json({
                message: "OTP sent successfully. Please verify to continue",
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    resendSignUpOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            console.log(email)

            await this._resendSignupOtpUseCase.execute(email);
            return res.status(HttpStatus.OK).json({ mmessage: "otp is sended" })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    verifySignupOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            await this._verifySignupOtpUseCase.execute(email, otp)
            res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.AUTH.OTP_VERIFIED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    googleLogin = async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'idToken is required'
                })
                return
            }

            const result = await this._googleLoginUseCase.execute(idToken);
            res.cookie("accessToken", result.accessToken, cookieOptions);
            res.cookie("refresh_token", result.refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });



            res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

}