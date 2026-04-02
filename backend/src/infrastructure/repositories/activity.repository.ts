import mongoose from "mongoose";
import { ActivityItem, IActivityRepository } from "../../domain/repositories/activity.repository";
import { TaskModel } from "../db/models/task.model";
import { WorklogModel } from "../db/models/worklog.model";

type TaskActivityDoc = {
    title: string;
    updatedAt: Date;
    assigneeId?: {
        name: string;
    } | null;
};

type WorklogActivityDoc = {
    timeSpent: number;
    createdAt: Date;
    userId?: {
        name: string;
    } | null;
    taskId?: {
        title: string;
    } | null;
};
export class ActivityRepository implements IActivityRepository {
    async getRecentActivities(companyId: string): Promise<ActivityItem[]> {
        const limit = 10;

        const objectId = new mongoose.Types.ObjectId(companyId);

        const tasks = (await TaskModel.find({
            companyId: objectId,
            status: "COMPLETED"
        })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .populate("assigneeId", "name")
            .select("title assigneeId updatedAt")) as unknown as TaskActivityDoc[];

        const taskActivities: ActivityItem[] = tasks.map((task: TaskActivityDoc) => ({
            type: "TASK_COMPLETED",
            message: `${task.assigneeId?.name || "Someone"} completed task "${task.title}"`,
            createdAt: task.updatedAt
        }));

        const worklogs = (await WorklogModel.find({
            companyId: objectId
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("userId", "name")
            .populate("taskId", "title")
            .select("timeSpent userId taskId createdAt")) as unknown as WorklogActivityDoc[];

        const worklogActivities: ActivityItem[] = worklogs.map((log: WorklogActivityDoc) => ({
            type: "WORKLOG_ADDED",
            message: `${log.userId?.name || "Someone"} logged ${Math.round(log.timeSpent / 60)}h on "${log.taskId?.title}"`,
            createdAt: log.createdAt
        }));


        const combined = [...taskActivities, ...worklogActivities]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);

        return combined;


    }
}