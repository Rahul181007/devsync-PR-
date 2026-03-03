import { Notification } from "../../../domain/entities/notification.entity";

export interface IGetUserNotificationsUseCase{
    execute(userId:string):Promise<Notification[]>
}