import { NotificationType } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { ICreateNotificationUseCase } from "../../interface/notification/ICreateNotificationUseCase";

export class CreateNotificationUseCase implements ICreateNotificationUseCase{
    constructor(
        private _notificationRepo:INotificationRepository
    ){}

    async execute(params: { userId: string; type: NotificationType; title: string; message: string; metadata?: Record<string, unknown> | null; }): Promise<void> {
        await this._notificationRepo.create(params)
    }
}