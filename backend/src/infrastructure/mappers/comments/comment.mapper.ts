import { Types } from "mongoose";
import { ICommentDocument } from "../../db/models/comment.model";
import { Comment } from "../../../domain/entities/comments.entity";

export class CommentMapper {

  // ✅ DB → Domain
  static toDomain(doc: ICommentDocument): Comment {
    return new Comment(
      doc._id.toString(),
      doc.taskId.toString(),
      doc.userId.toString(),
      doc.message,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: {
    taskId: string;
    userId: string;
    message: string;
  }) {
    return {
      taskId: new Types.ObjectId(data.taskId),
      userId: new Types.ObjectId(data.userId),
      message: data.message,
    };
  }
}