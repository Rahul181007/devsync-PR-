import mongoose,{Schema,Document} from "mongoose";


export interface IProjectDocument extends Document{
    companyId:mongoose.Types.ObjectId;
    name:string;
    slug:string;
    description?:string;
    status:'ACTIVE'|'ARCHIVED';
    startDate?:Date;
    endDate?:Date;
    currentSprintId?:mongoose.Types.ObjectId|null;
    createdBy:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date
}


const ProjectSchema=new Schema<IProjectDocument>(
    {
        companyId:{
            type:Schema.Types.ObjectId,
            ref:'Company',
            required:true,
            index:true
        },
        name:{
            type:String,
            required:true,
        },
        slug:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        status:{
            type:String,
            enum:['ACTIVE','ARCHIVED'],
            default:'ACTIVE'
        },
        startDate:{
            type:Date,
        },
        endDate:{
            type:Date,
        },
        currentSprintId:{
            type:Schema.Types.ObjectId,
            ref:'Sprint',
            default:null
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },
    {timestamps:true}

)

ProjectSchema.index({ companyId: 1, name: 1 }, { unique: true });

export const ProjectModel = mongoose.model<IProjectDocument>(
  "Project",
  ProjectSchema
);