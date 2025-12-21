import { Request, Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginSuperAdminUseCase } from "../../application/use-cases/auth/loginSuperAdmin.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshToken.usecase";
import { superAdminCookieOptions } from "../../config/superAdminCookieOption";
import { userCookieOptions } from "../../config/userCookieOptions";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";

export class AuthController {
    constructor(private loginSuperAdminUseCase: LoginSuperAdminUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase
    ) { }

    loginSuperAdmin = async (req: Request, res: Response) => {
        try {
            logger.info(`SuperAdmin login attempt:${req.body.email}`);
            const parsed = loginSchema.parse(req.body);

            const result = await this.loginSuperAdminUseCase.execute(parsed);
            logger.info(`SuperAdmin login successful: ${result.email}`)

            // storing accesstoken
            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/",
            });

            res.cookie(
                "refresh_token",
                result.refreshToken,
                superAdminCookieOptions
            );
            // store RefreshToken inside cookie
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
                accessToken: result.accessToken,
            })
        } catch (error: unknown) {
            return handleError(error, res, 400, 'SuperAdmin login failed')
        }
    }

    // refresh token
    refreshToken = async (req: Request, res: Response) => {
        try {
            logger.info(`Refresh token is recieved (superadmin)`)

            const refreshToken = req.cookies.refresh_token;
            logger.info(`${refreshToken}`)
            if (!refreshToken) {
                logger.warn('Refresh token is  missing')
                return res.status(400).json({ error: "Refresh token is required" });
            }

            const result = await this.refreshTokenUseCase.execute(refreshToken);

            logger.info(`Acccess token refreshed for user :${result.user.id}`)

            return res.json({
                message: "New access token generated",
                accessToken: result.accessToken,
                user: result.user
            });

        } catch (error: unknown) {
            return handleError(error, res, 401, 'Refresh token failed (superadmin)')

        }
    }

    me = async (req: Request, res: Response) => {
        res.setHeader("Cache-Control", "no-store"); //Cache-Control: no-store ensures auth state is never cached, preventing users from being accidentally logged in after logout
        return res.json({
            user: req.user
        })
    }

    logout = async (req: Request, res: Response) => {
        logger.info(' user logout requested');
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
        });
        res.clearCookie('refresh_token', superAdminCookieOptions);
        res.clearCookie('refresh_token', userCookieOptions);

        logger.info('user logged out successfully')
        return res.json({ message: 'Logged Out successfully' })
    }
}