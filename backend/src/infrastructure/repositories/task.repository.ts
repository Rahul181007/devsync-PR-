import { Task, TaskStatus } from "../../domain/entities/task.entity";
import { CreateTaskInput, ITaskRepository } from "../../domain/repositories/task.repository";
import { ITaskDocument, TaskModel } from "../db/models/task.model";

export class TaskRepository implements ITaskRepository {
    private _toDomain(doc: ITaskDocument): Task {
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
            doc.estimatedTime ?? null
        )
    }

    async create(task: CreateTaskInput): Promise<Task> {
        const doc = await TaskModel.create({
            companyId: task.companyId,
            projectId: task.projectId,
            sprintId: task.sprintId,
            parentId: task.parentId ?? undefined,

            code: task.code,
            title: task.title,
            description: task.description,
            type: task.type ?? "TASK",
            status: task.status,
            priority: task.priority,

            assigneeId: task.assigneeId,
            reporterId: task.reporterId,

            dueDate: task.dueDate ?? null,
            estimatedTime: task.estimatedTime ?? null,

        })
        return this._toDomain(doc)
    }
    async findById(taskId: string): Promise<Task | null> {
        const doc = await TaskModel.findById(taskId);
        return doc ? this._toDomain(doc) : null
    }

    async findBacklogTasks(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({
            projectId,
            sprintId: null
        }).sort({ createdAt: -1 })

        return docs.map((doc) => this._toDomain(doc))
    }

    async findByProjectId(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({
            projectId,

        }).sort({ createdAt: -1 })
        return docs.map((doc) => this._toDomain(doc))
    }

    async findByParentId(parentId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ parentId }).sort({ createdAt: -1 })
        return docs.map((doc) => this._toDomain(doc))
    }

    async update(task: Task): Promise<Task> {
        const doc = await TaskModel.findByIdAndUpdate(
            task.id,
            {
                sprintId: task.sprintId,
                title: task.title,
                description: task.description,
                type: task.type,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId,
                dueDate: task.dueDate ?? null,

                submission: task.submission ?? null,
                estimatedTime: task.estimatedTime ?? null,
            },
            { new: true }
        );

        if (!doc) {
            throw new Error("Task not found");
        }

        return this._toDomain(doc);
    }

    async findByAssigneeAndSprint(assigneeId: string, sprintId: string): Promise<Task[]> {
        const doc = await TaskModel.find({ assigneeId, sprintId })
        return doc.map((doc) => this._toDomain(doc))
    }

countByCompany(companyId:string) {
  return TaskModel.countDocuments({
    companyId,
    type: { $in: ["TASK", "BUG"] }
  });
}

    async countByStatus(
        companyId: string,
        status: TaskStatus
    ): Promise<number> {
        return await TaskModel.countDocuments({
            companyId,
            status
        });
    }

    async countOverdue(companyId: string): Promise<number> {
        const now = new Date();

        return await TaskModel.countDocuments({
            companyId,
            dueDate: { $lt: now },
            status: { $ne: "COMPLETED" }
        });
    }

}