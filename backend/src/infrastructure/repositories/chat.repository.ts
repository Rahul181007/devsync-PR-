import mongoose from "mongoose"
import { findMessageOptions, IChatRepository } from "../../domain/repositories/chat.repository";
import { ChatMessageModel, IChatMessageDocument } from "../db/models/chat.model";
import { ChatMessage } from "../../domain/entities/chat.entity";
import { ChatMapper } from "../mappers/chat/chat.mapper";

type ChatQuery = {
    projectId: mongoose.Types.ObjectId;
    createdAt?: {
        $lt?: Date
    }
}

type CreateChatMessageData = {
    projectId: string;
    senderId: string;
    senderName: string;
    message: string;

    attachmentUrl?: string | null;
    attachmentType?: "image" | "file" | null;
    fileName?: string | null;

    replyToMessageId?: string | null;
};

export class ChatRepository implements IChatRepository {


    async create(data: CreateChatMessageData): Promise<ChatMessage> {
        const doc = await ChatMessageModel.create(ChatMapper.toDocument(data));
        return ChatMapper.toDomain(doc)
    }

    async findByProjectId(projectId: string, options: findMessageOptions): Promise<ChatMessage[]> {
        const query: ChatQuery = {
            projectId: new mongoose.Types.ObjectId(projectId)
        }
        if (options.cursor) {
            const cursorDoc = await ChatMessageModel.findById(options.cursor);
            if (cursorDoc) {
                query.createdAt = { $lt: cursorDoc.createdAt }
            }
        }
        const docs = await ChatMessageModel.find(query).sort({ createdAt: -1 }).limit(options.limit).lean()

        return docs.reverse().map((doc) => ChatMapper.toDomain(doc as IChatMessageDocument))
    }

    async findById(id: string): Promise<ChatMessage | null> {
        const doc = await ChatMessageModel.findById(id);
        return doc ? ChatMapper.toDomain(doc) : null
    }
}