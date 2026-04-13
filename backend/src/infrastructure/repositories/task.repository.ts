import mongoose from "mongoose";
import { Task, TaskStatus } from "../../domain/entities/task.entity";
import { CreateTaskInput, ITaskRepository } from "../../domain/repositories/task.repository";
import {  TaskModel } from "../db/models/task.model";
import { TaskMapper } from "../mappers/task/task.mapper";


export class TaskRepository implements ITaskRepository {


    async create(task: CreateTaskInput): Promise<Task> {
        const doc = await TaskModel.create(TaskMapper.toDocument(task))
        return TaskMapper.toDomain(doc)
    }
    async findById(taskId: string): Promise<Task | null> {
        const doc = await TaskModel.findById(taskId);
        return doc ? TaskMapper.toDomain(doc) : null
    }

    async findBacklogTasks(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({
            projectId,
            sprintId: null
        }).sort({ createdAt: -1 })

        return docs.map((doc) => TaskMapper.toDomain(doc))
    }

    async findByProjectId(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({
            projectId,

        }).sort({ createdAt: -1 })
        return docs.map((doc) =>TaskMapper.toDomain(doc))
    }

    async findByParentId(parentId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ parentId }).sort({ createdAt: -1 })
        return docs.map((doc) => TaskMapper.toDomain(doc))
    }

    async update(task: Task): Promise<Task> {
        console.log("UPDATE TASK:", {
            id: task.id,
            type: task.type,
            storyPoints: task.storyPoints
        });
        const doc = await TaskModel.findByIdAndUpdate(
            task.id,
            TaskMapper.toDocument(task),
            { new: true }
        );

        if (!doc) {
            throw new Error("Task not found");
        }

        return TaskMapper.toDomain(doc);
    }

    async findByAssigneeAndSprint(assigneeId: string, sprintId: string): Promise<Task[]> {
        const doc = await TaskModel.find({ assigneeId, sprintId })
        return doc.map((doc) => TaskMapper.toDomain(doc))
    }

    async countByCompany(companyId: string) {
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
            status,
            type: { $in: ["TASK", "BUG"] }
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

    async findByIds(ids: string[]): Promise<Task[]> {
        const docs = await TaskModel.find({
            _id: { $in: ids }
        })
        return docs.map((doc) => TaskMapper.toDomain(doc))
    }

    async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
        await TaskModel.findByIdAndUpdate(taskId, { status });
    }
    async findBySprintId(sprintId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ sprintId });
        return docs.map((doc) => TaskMapper.toDomain(doc))
    }
}