import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { checkUserStatusUseCase } from "../../di/user.di";




export const checkUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED });
        }

        await checkUserStatusUseCase.execute(userId)
        next()
    } catch (error) {
        next(error)
    }
}