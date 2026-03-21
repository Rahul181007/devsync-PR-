import mongoose,{Schema,Document} from "mongoose";

export interface ICommentDocument extends Document{
    taskId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;

    message:string;

    createdAt:Date;
    updatedAt:Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
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

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);


CommentSchema.index({ taskId: 1, createdAt: -1 });

export const CommentModel = mongoose.model<ICommentDocument>(
  "Comment",
  CommentSchema
);