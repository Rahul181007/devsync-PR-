import mongoose from "mongoose";
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
            doc.estimatedTime ?? null,
            doc.storyPoints ?? null
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
            storyPoints:
                task.type === "STORY"
                    ? task.storyPoints
                    : undefined,

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
        console.log("UPDATE TASK:", {
    id: task.id,
    type: task.type,
    storyPoints: task.storyPoints
});
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
                storyPoints:
                    task.type === "STORY"
                        ? task.storyPoints ?? null
                        : null,
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

    countByCompany(companyId: string) {
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

    async getProjectHealth(companyId: string) {
        const result = await TaskModel.aggregate([
            {
                $match: {
                    companyId: new mongoose.Types.ObjectId(companyId),
                    type: { $in: ["TASK", "BUG"] }
                }
            },
            {
                $group: {
                    _id: "$projectId",
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            {
                $unwind: "$project"
            },
            {
                $project: {
                    projectId: "$_id",
                    projectName: "$project.name",
                    totalTasks: 1,
                    completedTasks: 1,
                    health: {
                        $round: [
                            {
                                $cond: [
                                    { $eq: ["$totalTasks", 0] },
                                    0,
                                    {
                                        $multiply: [
                                            { $divide: ["$completedTasks", "$totalTasks"] },
                                            100
                                        ]
                                    }
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $sort: { health: -1 }
            }
        ]);

        return result;
    }

    async countTasksByStatusForUser(userId: string): Promise<
        { _id: TaskStatus; count: number }[]
    > {
        const objectUserId = new mongoose.Types.ObjectId(userId);

        const result = await TaskModel.aggregate([
            {
                $match: {
                    assigneeId: objectUserId,
                    type: { $in: ["TASK", "BUG"] } // keep consistency with your other methods
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        return result;
    }

    async getPriorityTasks(userId: string): Promise<{
        id: string;
        title: string;
        projectName: string;
        status: string;
        priority: string;
        dueDate: Date | null;
    }[]> {

        const docs = await TaskModel.find({
            assigneeId: new mongoose.Types.ObjectId(userId),
            status: { $ne: "COMPLETED" },
            type: { $in: ["TASK", "BUG"] }
        })
            .sort({
                dueDate: 1,
                priority: -1
            })
            .limit(5)
            .populate("projectId", "name")
            .lean<{
                _id: mongoose.Types.ObjectId;
                title: string;
                status: string;
                priority: string;
                dueDate?: Date | null;
                projectId: {
                    name: string;
                };
            }[]>();

        return docs.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            status: doc.status,
            priority: doc.priority,
            dueDate: doc.dueDate ?? null,
            projectName: doc.projectId?.name || "Unknown"
        }));
    }
}