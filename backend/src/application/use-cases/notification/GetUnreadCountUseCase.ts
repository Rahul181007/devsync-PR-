import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IGetUnreadCountUseCase } from "../../interface/notification/IGetUnreadCountUseCase";

export class GetUnreadCountUseCase implements IGetUnreadCountUseCase{
    constructor(
        private _notificationRep: INotificationRepository
    ){}

    async execute(userId: string): Promise<number> {
        return this._notificationRep.countUnreadByUser(userId)
    }
}