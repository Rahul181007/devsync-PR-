import mongoose,{Schema,Document} from "mongoose";

export interface IUserDocument extends Document{
    companyId:mongoose.Types.ObjectId|null;
    name:string;
    email:string;
    passwordHash:string;
    role:'COMPANY_ADMIN'|'DEVELOPER';
    avatarUrl:string|null;
    status:"ACTIVE" |'BLOCKED';
    settings:{
      theme?: string;
      notificationPreferences?: Record<string, any>;
    }
    createdAt:Date;
    updatedAt:Date,
    lastLoginAt:Date|null
}

const UserSchema= new Schema<IUserDocument>(
    {
        companyId:{
            type:Schema.Types.ObjectId,
            ref:'Company',
            default:null
        },
        name:{
            type:String,
            default:''
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        passwordHash:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:['COMPANY_ADMIN','DEVELOPER'],
            required:true
        },
        avatarUrl:{
            type:String,
            default:null
        },
        status:{
            type:String,
            enum:["ACTIVE",'INACTIVE','SUSPENDED'],
            default :'ACTIVE'
        },
        settings:{
          theme: { type: String, default: "light" },
          notificationPreferences: { type: Object, default: {} }, 
        },
        lastLoginAt:{
            type:Date,
            default:null
        }

    },
    {timestamps:true}
);

export const UserModel=mongoose.model<IUserDocument>('User',UserSchema)