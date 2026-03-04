import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IMarkNotificationAsReadUseCase } from "../../interface/notification/IMarkNotificationAsReadUseCase";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}

    async execute(notificationId: string, userId: string): Promise<void> {
        const notifications=await this._notificationRepo.findByUserId(userId);

        const notification=notifications.find((n)=>n.id===notificationId);
        if(!notification){
            throw new AppError(RESPONSE_MESSAGES.NOTIFICATION.NOT_FOUND,HttpStatus.NOT_FOUND);
        }
        await this._notificationRepo.markAsRead(notificationId)
    }
}