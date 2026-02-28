import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessageDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;

  message: string;
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
    message: {
      type: String,
      required: true,
      trim: true,
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