import { Notification, NotificationType } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/repositories/notification.repository";
import {  NotificationModel } from "../db/models/notification.model";
import { NotificationMapper } from "../mappers/notification/notification.mapper";

export class NotificationRepository implements INotificationRepository {


    async create(data: { userId: string; type: NotificationType; title: string; message: string; metadata?: Record<string, unknown> | null; }): Promise<Notification> {
        const doc = await NotificationModel.create(NotificationMapper.toDocument(data))
        return NotificationMapper.toDomain(doc)
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        const docs=await NotificationModel.find({
            userId,
            isRead: false
        }).sort({createdAt:-1})

        return docs.map(doc=>NotificationMapper.toDomain(doc))
    }

  async markAsRead(notificationId: string): Promise<void> {
      await NotificationModel.findByIdAndUpdate(notificationId,{
        isRead:true
      })
  }

  async countUnreadByUser(userId: string): Promise<number> {
  return NotificationModel.countDocuments({
    userId,
    isRead: false
  });
}
async markAllAsRead(userId: string): Promise<void> {
  await NotificationModel.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
}
    
}