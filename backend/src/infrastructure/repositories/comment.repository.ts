import { Comment } from "../../domain/entities/comments.entity";
import { CommentWithUser, ICommentRepository } from "../../domain/repositories/comment.repository";
import { CommentModel, ICommentDocument } from "../db/models/comment.model";

export class CommentRepository implements ICommentRepository {
    private _toDomain(doc: ICommentDocument): Comment {
        return new Comment(
            doc._id.toString(),
            doc.taskId.toString(),
            doc.userId.toString(),
            doc.message,
            doc.createdAt,
            doc.updatedAt
        )
    }

    async create(comment: { taskId: string; userId: string; message: string; }): Promise<Comment> {
        const doc = await CommentModel.create(comment);
        return this._toDomain(doc)
    }

    async findByTaskId(taskId: string): Promise<Comment[]> {
        const docs = await CommentModel.find({ taskId }).sort({ createdAt: -1 })
        return docs.map((doc) => this._toDomain(doc))
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