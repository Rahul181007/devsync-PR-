import { Types } from "mongoose";
import { ITaskAttachmentDocument } from "../../db/models/taskAttachment.model";
import { TaskAttachment } from "../../../domain/entities/Attachment.entity";

export class TaskAttachmentMapper {

  // ✅ DB → Domain
  static toDomain(doc: ITaskAttachmentDocument): TaskAttachment {
    return new TaskAttachment(
      doc._id.toString(),
      doc.taskId.toString(),
      doc.projectId.toString(),
      doc.companyId.toString(),
      doc.uploadedBy.toString(),
      doc.fileName,
      doc.fileUrl,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: {
    taskId: string;
    projectId: string;
    companyId: string;
    uploadedBy: string;
    fileName: string;
    fileUrl: string;
  }) {
    return {
      taskId: new Types.ObjectId(data.taskId),
      projectId: new Types.ObjectId(data.projectId),
      companyId: new Types.ObjectId(data.companyId),
      uploadedBy: new Types.ObjectId(data.uploadedBy),
      fileName: data.fileName,
      fileUrl: data.fileUrl,
    };
  }
}