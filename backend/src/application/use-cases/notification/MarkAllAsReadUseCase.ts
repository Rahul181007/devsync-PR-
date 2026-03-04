import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IMarkAllAsReadUseCase } from "../../interface/notification/IMarkAllAsReadUseCase";

export class MarkAllAsReadUseCase implements IMarkAllAsReadUseCase{
    constructor(
      private _notificationRepo:INotificationRepository    
    ){}

    async execute(userId: string): Promise<void> {
        await this._notificationRepo.markAllAsRead(userId);
    }
}