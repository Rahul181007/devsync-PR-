import { TaskAttachment } from "../../domain/entities/Attachment.entity";
import { ITaskAttachmentRepository } from "../../domain/repositories/attachment.repository";
import { ITaskAttachmentDocument, TaskAttachmentModel } from "../db/models/taskAttachment.model";

export class TaskAttachmentRepository implements ITaskAttachmentRepository {
    private _toDomain(doc: ITaskAttachmentDocument): TaskAttachment {
        return new TaskAttachment(
            doc._id.toString(),
            doc.taskId.toString(),
            doc.projectId.toString(),
            doc.companyId.toString(),
            doc.uploadedBy.toString(),
            doc.fileName,
            doc.fileUrl,
            doc.createdAt,
            doc.updatedAt,

        )
    }

    async create(data: { taskId: string; projectId: string; companyId: string; uploadedBy: string; fileName: string; fileUrl: string; }): Promise<TaskAttachment> {
        const doc = await TaskAttachmentModel.create(data);
        return this._toDomain(doc)
    }

    async findByTaskId(taskId: string): Promise<TaskAttachment[]> {
        const docs = await TaskAttachmentModel.find({ taskId })
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 });
        return docs.map((doc) => this._toDomain(doc))
    }
}