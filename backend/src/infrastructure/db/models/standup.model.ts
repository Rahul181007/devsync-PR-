import mongoose, { Schema, Document } from "mongoose";

export interface IStandupDocument extends Document {
    projectId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    sprintId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    standupDate: Date;

    yesterday: string;
    today: string;
    blockers?: string;
    mood: "HAPPY"| "GOOD" | "NEUTRAL" | "STRESSED"|"BLOCKED";

    createdAt: Date;
    updatedAt: Date;
}

const StandupSchema = new Schema<IStandupDocument>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },
        sprintId: {
            type: Schema.Types.ObjectId,
            ref: "Sprint",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        standupDate: {
            type: Date,
            required: true,
            index: true,
        },
        yesterday: {
            type: String,
            required: true,
        },
        today: {
            type: String,
            required: true,
        },
        blockers: {
            type: String,
            default: null,
        },
        mood: {
            type: String,
            enum: ["HAPPY", "GOOD", "NEUTRAL", "STRESSED", "BLOCKED"],
            required: true,
        },

    },
    { timestamps: true }
);

StandupSchema.index(
    { sprintId: 1, userId: 1, standupDate: 1 },
    { unique: true }
);







export const StandupModel = mongoose.model<IStandupDocument>(
    "Standup",
    StandupSchema
);
