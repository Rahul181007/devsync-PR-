import { Request, Response } from "express";
import { IGetUserNotificationsUseCase } from "../../application/interface/notification/IGetUserNotificationsUseCase";
import { IMarkNotificationAsReadUseCase } from "../../application/interface/notification/IMarkNotificationAsReadUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";
import { IGetUnreadCountUseCase } from "../../application/interface/notification/IGetUnreadCountUseCase";
import { IMarkAllAsReadUseCase } from "../../application/interface/notification/IMarkAllAsReadUseCase";

export class NotificationController {
    constructor(
        private _getUserNotificationsUseCase: IGetUserNotificationsUseCase,
        private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
        private _getUnreadCountUseCase:IGetUnreadCountUseCase,
        private _markAllAsReadUseCase:IMarkAllAsReadUseCase
    ) { }

    getMyNotification=async (req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            if(!userId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const notifications=await this._getUserNotificationsUseCase.execute(userId);
            return res.status(HttpStatus.OK).json({
                success:true,
                data:notifications
            })
        } catch (error:unknown) {
            return handleError(error,res);
        }
    }


    markAsRead=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const { notificationId } = req.params;
          if (!userId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }
      
      await this._markNotificationAsReadUseCase.execute(notificationId,userId)
      
      return res.status(HttpStatus.OK).json({
        success:true,
        message:"Notification marked as read"
      })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getUnreadCount=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            if(!userId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const count=await this._getUnreadCountUseCase.execute(userId);

            return res.status(HttpStatus.OK).json({
                success:true,
                data:{count}
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    markAllAsRead=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            if(!userId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            
            await this._markAllAsReadUseCase.execute(userId);

            return res.status(HttpStatus.OK).json({
                success:true,
                message: "All notifications marked as read"
            })
        } catch (error:unknown) {
            return handleError(error, res);
        }
    }

}