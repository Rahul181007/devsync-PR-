import { Types } from "mongoose";
import { ChatMessage } from "../../../domain/entities/chat.entity";
import { IChatMessageDocument } from "../../db/models/chat.model";

export class ChatMapper {
    static toDomain(doc: IChatMessageDocument): ChatMessage {
        return new ChatMessage(
            doc._id.toString(),
            doc.projectId.toString(),
            doc.senderId.toString(),
            doc.senderName,
            doc.message,
            doc.attachmentUrl ?? null,
            doc.attachmentType as "image" | "file" | null,
            doc.fileName ?? null,
            doc.replyToMessageId ? doc.replyToMessageId.toString() : null,
            doc.createdAt,
            doc.updatedAt
        )
    }

    static toDocument(data:Partial<ChatMessage>){
        return {
                  projectId: new Types.ObjectId(data.projectId),
      senderId: new Types.ObjectId(data.senderId),
      senderName: data.senderName,
      message: data.message,
      attachmentUrl: data.attachmentUrl ?? null,
      attachmentType: data.attachmentType ?? null,
      fileName: data.fileName ?? null,
      replyToMessageId: data.replyToMessageId
        ? new Types.ObjectId(data.replyToMessageId)
        : undefined,
        }
    }
}