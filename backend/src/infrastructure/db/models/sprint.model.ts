import mongoose, { Schema, Document } from "mongoose";

export interface ISprintDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;

  name: string;
  goal?: string;

  startDate: Date;
  endDate: Date;

  status: "PLANNED" | "ACTIVE" | "COMPLETED";

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<ISprintDocument>(
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
    name: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PLANNED", "ACTIVE", "COMPLETED"],
      default: "PLANNED",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate sprint names inside same project
SprintSchema.index({ projectId: 1, name: 1 }, { unique: true });

// Useful for querying active sprint
SprintSchema.index({ projectId: 1, status: 1 });

export const SprintModel = mongoose.model<ISprintDocument>(
  "Sprint",
  SprintSchema
);

