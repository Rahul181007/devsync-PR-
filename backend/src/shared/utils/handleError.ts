import { Response } from "express";
import { logger } from "../logger/logger";
import { AppError } from "../errors/AppError";

export function handleError(
    error:unknown,
    res:Response,
    defaultStatus=500,
    defaultMessage='Internal server error'
){
    logger.error(defaultMessage,error)

    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            error:error.message
        })
    }

    if(error instanceof Error){
        return res.status(defaultStatus).json({
            error:error.message
        })
    }

    return res.status(defaultStatus).json({
        error:defaultMessage
    })
}