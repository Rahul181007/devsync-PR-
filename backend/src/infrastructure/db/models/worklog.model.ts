import mongoose, { Schema, Document } from "mongoose";

export interface IWorklogDocument extends Document {
    companyId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    timeSpent: number;
    description?: string;

    date: Date;

    createdAt: Date;
    updatedAt: Date;
}

const WorklogSchema = new Schema<IWorklogDocument>(
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

        taskId: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        timeSpent: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

WorklogSchema.index({ taskId: 1, date: -1 });
WorklogSchema.index({ projectId: 1, date: -1 });
WorklogSchema.index({ userId: 1, date: -1 });

export const WorklogModel = mongoose.model<IWorklogDocument>(
    "Worklog",
    WorklogSchema
);