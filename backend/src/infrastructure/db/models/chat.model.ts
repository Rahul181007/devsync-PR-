import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessageDocument extends Document {
    projectId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;

    senderName: string;


    message: string;
    attachmentUrl: string | null;
    attachmentType: "image" | "file" | null;
    fileName: string | null;

    replyToMessageId?: mongoose.Types.ObjectId | null;

    createdAt: Date;
    updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessageDocument>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        senderName: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },

        attachmentUrl: {
            type: String,
            default: null,
        },

        attachmentType: {
            type: String,
            enum: ["image", "file"],
            default: null,
        },

        fileName: {
            type: String,
            default: null,
        },
        replyToMessageId: {
            type: Schema.Types.ObjectId,
            ref: "ChatMessage",
            default: null,
        },
    },
    { timestamps: true }
);


ChatMessageSchema.index({ projectId: 1, createdAt: -1 });

export const ChatMessageModel = mongoose.model<IChatMessageDocument>(
    "ChatMessage",
    ChatMessageSchema
);