import {Schema,model,Document} from 'mongoose';

export interface SuperAdminDocument extends Document{
    name:string;
    email:string;
    passwordHash:string;
    role:'SUPER_ADMIN';
    avatarUrl?:string|null;
    status:string;
    createdAt:Date;
    updatedAt:Date;
    lastLoginAt?:Date|null
}


const superAdminSchema=new Schema <SuperAdminDocument>(
    {
        name:{
            type:String,
            required:true
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
            default:'SUPER_ADMIN'
        },
        avatarUrl:{
            type:String,
            default:null,
        },
        status:{
            type:String,
            default:'ACTIVE'
        },
        lastLoginAt:{
            type:Date,
            default:null
        }

    },
    {timestamps:true}
)

export const SuperAdminModel=model<SuperAdminDocument>(
    'SuperAdmin',
    superAdminSchema
)