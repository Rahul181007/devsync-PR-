import mongoose ,{Schema,Document} from "mongoose";

export interface IProjectMemberDocument extends Document{
    projectId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    role: "OWNER" | "ADMIN" | "DEVELOPER";
    createdAt:Date;
}

const ProjectMemberSchema=new Schema<IProjectMemberDocument>(
    {

        projectId:{
            type:Schema.Types.ObjectId,
            ref:'Project',
            required:true,
            index:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true
        },
        role:{
            type:String,
             enum: ["OWNER", "ADMIN", "DEVELOPER"],
             required:true
        }
    },
    {timestamps:true}
)

ProjectMemberSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

export const ProjectMemberModel = mongoose.model<IProjectMemberDocument>(
  "ProjectMember",
  ProjectMemberSchema
);