import mongoose, { Schema, Document } from "mongoose";

export interface ITaskDocument extends Document {
    companyId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    sprintId?: mongoose.Types.ObjectId | null;

    code: string;
    title: string;
    description: string;

    status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";

    assigneeId?: mongoose.Types.ObjectId | null;
    reporterId: mongoose.Types.ObjectId;

    dueDate?: Date | null;
    
    submission?: {
        summary: string;
        workDone: string;
        blockers: string | null;
        submittedAt: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        sprintId: {
            type: Schema.Types.ObjectId,
            ref: "Sprint",
            default: null,
        },

        code: {
            type: String,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["BACKLOG", "TODO", "IN_PROGRESS", "SUBMITTED", "COMPLETED"],
            default: "BACKLOG",
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true,
        },

        assigneeId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reporterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },
        submission: {
            summary: { type: String, trim: true },
            workDone: { type: String, trim: true },
            blockers: { type: String, default: null },
            submittedAt: { type: Date },
        },
    },
    { timestamps: true }
);


TaskSchema.index({ companyId: 1, projectId: 1 });
TaskSchema.index({ projectId: 1, sprintId: 1 });

export const TaskModel = mongoose.model<ITaskDocument>(
    "Task",
    TaskSchema
);
