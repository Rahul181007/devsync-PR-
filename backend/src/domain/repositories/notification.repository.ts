import { Notification, NotificationType } from "../entities/notification.entity";

export interface INotificationRepository{
    create(data:{
        userId:string;
        type:NotificationType;
        title:string;
        message:string;
        metadata?:Record<string,unknown>|null;
    }):Promise<Notification>

    findByUserId(userId:string):Promise<Notification[]>;
    markAsRead(notificationId:string):Promise<void>;
    countUnreadByUser(userId: string): Promise<number>;
    markAllAsRead(userId: string): Promise<void>;
} 