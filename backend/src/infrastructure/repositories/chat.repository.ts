import mongoose from "mongoose"
import { findMessageOptions, IChatRepository } from "../../domain/repositories/chat.repository";
import { ChatMessageModel, IChatMessageDocument } from "../db/models/chat.model";
import { ChatMessage } from "../../domain/entities/chat .entity";

type ChatQuery={
    projectId:mongoose.Types.ObjectId;
    createdAt?:{
        $lt?:Date
    }
}

export class ChatRepository implements IChatRepository{

    private _toDomain(doc:IChatMessageDocument):ChatMessage{
        return new ChatMessage(
            doc._id.toString(),
            doc.projectId.toString(),
            doc.senderId.toString(),
            doc.message,
            doc.replyToMessageId?doc.replyToMessageId.toString():null,
            doc.createdAt,
            doc.updatedAt
        )
    }

    async create(data: Partial<ChatMessage>): Promise<ChatMessage> {
        const doc=await ChatMessageModel.create({
            projectId:data.projectId,
            senderId:data.senderId,
            message:data.message,
            replyToMessageId:data.replyToMessageId?? undefined
        })
        return this._toDomain(doc)
    }

    async findByProjectId(projectId: string, options: findMessageOptions): Promise<ChatMessage[]> {
        const query:ChatQuery={
            projectId:new mongoose.Types.ObjectId(projectId)
        }
        if(options.cursor){
            const cursorDoc=await ChatMessageModel.findById(options.cursor);
            if(cursorDoc){
                query.createdAt={$lt:cursorDoc.createdAt}
            }
        }
        const docs=await ChatMessageModel.find(query).sort({createdAt:-1}).limit(options.limit).lean()

        return docs.reverse().map((doc)=>this._toDomain(doc as IChatMessageDocument))
    }

    async findById(id: string): Promise<ChatMessage | null> {
        const doc=await ChatMessageModel.findById(id);
        return doc?this._toDomain(doc):null
    }
}