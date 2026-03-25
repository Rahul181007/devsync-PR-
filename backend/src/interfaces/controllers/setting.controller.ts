import { Request, Response } from "express";
import { ISendOtpForAuthenticatedUserUseCase } from "../../application/interface/auth/ISendOtpForAuthenticatedUserUseCase";

import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";
import { IVerifyOtpForAuthenticatedUserUseCase } from "../../application/interface/auth/IVerifyOtpForAuthenticatedUserUseCase";
import { IResetPasswordForAuthenticatedUserUseCase } from "../../application/interface/auth/IResetPasswordForAuthenticatedUserUseCase";
import { IGetProfileUseCase } from "../../application/interface/auth/IGetProfileUseCase";
import { IUpdateProfileUseCase } from "../../application/interface/auth/IUpdateProfileUseCase";
import { updateProfileSchema } from "../../application/validators/auth/updateProfile.validato";
import { IUpdateProfileAvatarUseCase } from "../../application/interface/auth/IUpdateProfileAvatarUseCase";
import { IUpdateCompanyLogoFromSettingsUseCase } from "../../application/interface/company/IUpdateCompanyLogoFromSettingsUseCase";


export class SettingsController {
    constructor(
        private _sendOtpUseCase: ISendOtpForAuthenticatedUserUseCase,
        private _verifyOtpUseCase: IVerifyOtpForAuthenticatedUserUseCase,
        private _resetPasswordUseCase: IResetPasswordForAuthenticatedUserUseCase,
        private _getProfileUseCase: IGetProfileUseCase,
        private _updateProfileUseCase: IUpdateProfileUseCase,
        private _updateProfileAvatarUseCase: IUpdateProfileAvatarUseCase,
        private _updateCompanyLogoFromSettingsUseCase:IUpdateCompanyLogoFromSettingsUseCase
    ) { }

    sendOtp = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {

                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const response = await this._sendOtpUseCase.execute(userId);
            return res.status(HttpStatus.OK).json(response)


        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const { otp } = req.body;

            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const response = await this._verifyOtpUseCase.execute(userId, otp);
            return res.status(HttpStatus.OK).json(response);
        } catch (error: unknown) {
            handleError(error, res)
        }
    }

    changePassword = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const { newPassword } = req.body
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const response = await this._resetPasswordUseCase.execute(
                userId,
                newPassword
            );

            return res.status(HttpStatus.OK).json(response)
        } catch (error: unknown) {
            handleError(error, res)
        }
    }


    getProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const response = await this._getProfileUseCase.execute(userId);
            return res.status(HttpStatus.OK).json(response)
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    updateProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const parsed = updateProfileSchema.parse(req.body)

            const response = await this._updateProfileUseCase.execute(userId, parsed)

            return res.status(HttpStatus.OK).json(response)
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    updateAvatar = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const file = req.file;
            console.log(file)
            if (!file) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "File is required",
                });
            }
            const response=await this._updateProfileAvatarUseCase.execute(userId,{
                buffer:file.buffer,
                mimetype:file.mimetype,
                originalname:file.originalname
            })

            return res.status(HttpStatus.OK).json(response)

        } catch (error:unknown) {
           return handleError(error,res)
        }
    }

    updateCompanyLogo=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
                        if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const file = req.file;

            if (!file) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "File is required",
                });
            }

            const  response= await this._updateCompanyLogoFromSettingsUseCase.execute({
                userId,
                file:{
                    buffer:file.buffer,
                    mimetype:file.mimetype
                }
            })
            return res.status(HttpStatus.OK).json(response)
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

}