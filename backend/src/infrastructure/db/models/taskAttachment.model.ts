import mongoose ,{Schema,Document} from "mongoose";

export interface ITaskAttachmentDocument extends Document{
    taskId:mongoose.Types.ObjectId;
    projectId:mongoose.Types.ObjectId;
    companyId:mongoose.Types.ObjectId;

    uploadedBy:mongoose.Types.ObjectId;

    fileName:string;
    fileUrl:string;

    createdAt:Date;
    updatedAt:Date;
}

const TaskAttachmentSchema = new Schema<ITaskAttachmentDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

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

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



TaskAttachmentSchema.index({ taskId: 1, createdAt: -1 });

export const TaskAttachmentModel = mongoose.model<ITaskAttachmentDocument>(
  "TaskAttachment",
  TaskAttachmentSchema
);