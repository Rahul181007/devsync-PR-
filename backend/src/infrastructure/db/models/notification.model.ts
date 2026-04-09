import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "../../../domain/entities/notification.entity";

export interface INotificationDocument extends Document {
    userId: mongoose.Types.ObjectId;

    type: NotificationType;
    title: string;
    message: string;

    metadata?: Record<string, unknown> | null;

    isRead: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "COMPANY_APPROVED",
                "COMPANY_REJECTED",
                "COMPANY_SUSPENDED",
                "COMPANY_REACTIVATED",
                "TASK_ASSIGNED",
                "TASK_SUBMITTED",
                "SPRINT_STARTED",
                "SPRINT_COMPLETED",
                "AI_PROJECT_DELAYED",
                "COMPANY_SUBMITTED_FOR_APPROVAL",
                "COMPANY_REAPPLIED",
                "MEETING_CREATED",
                "SPRINT_REVIEW_SCHEDULED"
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        metadata: {
            type: Object,
            default: null
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true
        }

    },
    { timestamps: true }
)

NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>(
    "Notification",
    NotificationSchema
);