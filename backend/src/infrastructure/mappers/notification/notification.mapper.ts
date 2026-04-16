import { Types } from "mongoose";
import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationDocument } from "../../db/models/notification.model";

export class NotificationMapper {

  // ✅ DB → Domain
  static toDomain(doc: INotificationDocument): Notification {
    return new Notification(
      doc._id.toString(),
      doc.userId.toString(),
      doc.type,
      doc.title,
      doc.message,
      doc.metadata ?? null,
      doc.isRead,
      doc.createdAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown> | null;
    isRead?: boolean;
  }) {
    return {
      userId: new Types.ObjectId(data.userId),
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata ?? null,
      isRead: data.isRead ?? false,
    };
  }
}