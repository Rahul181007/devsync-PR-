import mongoose, { Schema } from "mongoose";

export interface IMeetingDocument extends Document {
    _id: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    sprintId?: mongoose.Types.ObjectId | null;

    title: string;
    description: string | null;

    scheduledAt: Date;
    durationMinutes: number | null;

    meetingLink: string | null;
    meetingType: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER" | null;
    type: "SPRINT_PLANNING" | "SPRINT_REVIEW" | "STANDUP" | "GENERAL";
    notes: string | null;
    decisions: string | null;

    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    isReminderSent: boolean,

    createdAt: Date;
    updatedAt: Date;
}

const MeetingSchema = new Schema<IMeetingDocument>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sprintId: {
            type: Schema.Types.ObjectId,
            ref: "Sprint",
            default: null,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: null,
        },

        scheduledAt: {
            type: Date,
            required: true,
        },

        durationMinutes: {
            type: Number,
            default: null,
        },

        meetingLink: {
            type: String,
            default: null,
        },

        meetingType: {
            type: String,
            enum: ["GOOGLE_MEET", "ZOOM", "TEAMS", "OTHER"],
            default: null,
        },

        type: {
            type: String,
            enum: ["SPRINT_PLANNING", "SPRINT_REVIEW", "STANDUP", "GENERAL"],
            default: "GENERAL",
        },

        notes: {
            type: String,
            default: null,
        },

        decisions: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
            default: "SCHEDULED",
        },

        isReminderSent: {
  type: Boolean,
  default: false,
},
    },
    { timestamps: true }
);



MeetingSchema.index({ projectId: 1, scheduledAt: -1 });
MeetingSchema.index({ sprintId: 1 });


export const MeetingModel = mongoose.model<IMeetingDocument>(
    "Meeting",
    MeetingSchema
);