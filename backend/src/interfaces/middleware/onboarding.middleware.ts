import { Request,Response,NextFunction } from "express";
import { HttpStatus } from "../../shared/constants/httpStatus";

export const blockOnboardingUsers=(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    if(req.user?.onboarding){
        return res.status(HttpStatus.FORBIDDEN).json({
            message:'Complete onboarding for access this resource'
        })
    }
    next()
}