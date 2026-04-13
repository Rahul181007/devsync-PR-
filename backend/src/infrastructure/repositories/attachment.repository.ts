import { TaskAttachment } from "../../domain/entities/Attachment.entity";
import { ITaskAttachmentRepository } from "../../domain/repositories/attachment.repository";
import {  TaskAttachmentModel } from "../db/models/taskAttachment.model";
import { TaskAttachmentMapper } from "../mappers/attachment/taskAttachment.mapper";

export class TaskAttachmentRepository implements ITaskAttachmentRepository {


    async create(data: { taskId: string; projectId: string; companyId: string; uploadedBy: string; fileName: string; fileUrl: string; }): Promise<TaskAttachment> {
        const doc = await TaskAttachmentModel.create(TaskAttachmentMapper.toDocument(data));
        return TaskAttachmentMapper.toDomain(doc)
    }

    async findByTaskId(taskId: string): Promise<TaskAttachment[]> {
        const docs = await TaskAttachmentModel.find({ taskId })
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 });
        return docs.map((doc) => TaskAttachmentMapper.toDomain(doc))
    }
}