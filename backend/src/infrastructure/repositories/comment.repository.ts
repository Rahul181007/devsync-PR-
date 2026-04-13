import { Comment } from "../../domain/entities/comments.entity";
import { CommentWithUser, ICommentRepository } from "../../domain/repositories/comment.repository";
import { CommentModel } from "../db/models/comment.model";
import { CommentMapper } from "../mappers/comments/comment.mapper";

export class CommentRepository implements ICommentRepository {


    async create(comment: { taskId: string; userId: string; message: string; }): Promise<Comment> {
        const doc = await CommentModel.create(CommentMapper.toDocument(comment));
        return CommentMapper.toDomain(doc)
    }

    async findByTaskId(taskId: string): Promise<Comment[]> {
        const docs = await CommentModel.find({ taskId }).sort({ createdAt: -1 })
        return docs.map((doc) => CommentMapper.toDomain(doc))
    }

    async findByTaskIdWithUser(taskId: string): Promise<CommentWithUser[]> {
        const docs = await CommentModel.find({ taskId })
            .populate<{ userId: { _id: string; name: string } }>("userId", "name")
            ;

        return docs.map((doc) => ({
            id: doc._id.toString(),
            taskId: doc.taskId.toString(),
            userId: doc.userId._id.toString(),
            userName: doc.userId.name,
            message: doc.message,
            createdAt: doc.createdAt,
        }));
    }
}