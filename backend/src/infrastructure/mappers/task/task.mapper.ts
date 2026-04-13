import { Types } from "mongoose";
import { Task } from "../../../domain/entities/task.entity";
import { CreateTaskInput } from "../../../domain/repositories/task.repository";
import { ITaskDocument } from "../../db/models/task.model";

export class TaskMapper {

    // ✅ DB → Domain
    static toDomain(doc: ITaskDocument): Task {
        return new Task(
            doc._id.toString(),
            doc.companyId.toString(),
            doc.projectId.toString(),
            doc.sprintId ? doc.sprintId.toString() : null,
            doc.parentId ? doc.parentId.toString() : null,
            doc.code,
            doc.title,
            doc.description,
            doc.type,
            doc.status,
            doc.priority,
            doc.assigneeId ? doc.assigneeId.toString() : null,
            doc.reporterId.toString(),
            doc.dueDate ?? null,
            doc.createdAt,
            doc.updatedAt,
            doc.submission
                ? {
                    summary: doc.submission.summary,
                    workDone: doc.submission.workDone,
                    blockers: doc.submission.blockers ?? null,
                    submittedAt: doc.submission.submittedAt,
                }
                : null,
            doc.estimatedTime ?? null,
            doc.storyPoints ?? null
        );
    }


    static toDocument(data: CreateTaskInput | Task) {
        return {
            companyId: new Types.ObjectId(data.companyId),
            projectId: new Types.ObjectId(data.projectId),
            sprintId: data.sprintId
                ? new Types.ObjectId(data.sprintId)
                : null,
            parentId: data.parentId
                ? new Types.ObjectId(data.parentId)
                : undefined,

            code: data.code,
            title: data.title,
            description: data.description,
            type: data.type ?? "TASK",
            status: data.status,
            priority: data.priority,

            assigneeId: data.assigneeId
                ? new Types.ObjectId(data.assigneeId)
                : null,
            reporterId: new Types.ObjectId(data.reporterId),

            dueDate: data.dueDate ?? null,
            estimatedTime: data.estimatedTime ?? null,
            storyPoints:
                data.type === "STORY" ? data.storyPoints ?? undefined : undefined,

            submission: "submission" in data
                ? data.submission ?? undefined
                : undefined,
        };
    }
}
