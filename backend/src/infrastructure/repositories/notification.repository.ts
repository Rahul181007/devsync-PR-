import { Notification, NotificationType } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/repositories/notification.repository";
import { INotificationDocument, NotificationModel } from "../db/models/notification.model";

export class NotificationRepository implements INotificationRepository {
    private _toDomain(doc: INotificationDocument): Notification {
        return new Notification(
            doc._id.toString(),
            doc.userId.toString(),
            doc.type,
            doc.title,
            doc.message,
            doc.metadata ?? null,
            doc.isRead,
            doc.createdAt
        )
    }

    async create(data: { userId: string; type: NotificationType; title: string; message: string; metadata?: Record<string, unknown> | null; }): Promise<Notification> {
        const doc = await NotificationModel.create({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata ?? null,
            isRead: false,
        })
        return this._toDomain(doc)
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        const docs=await NotificationModel.find({
            userId,

        }).sort({createdAt:-1})

        return docs.map(doc=>this._toDomain(doc))
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