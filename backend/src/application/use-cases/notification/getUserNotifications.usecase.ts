import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IGetUserNotificationsUseCase } from "../../interface/notification/IGetUserNotificationsUseCase";

export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}

    async execute(userId: string): Promise<Notification[]> {
        return this._notificationRepo.findByUserId(userId)
    }
}