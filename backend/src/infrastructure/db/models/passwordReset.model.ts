import mongoose,{Schema,Document} from "mongoose";



export interface IPasswordResetDocument extends Document{
    email:string,
    otp:string,
    expiresAt:Date,
    createdAt:Date
}

const PasswordResetSchema=new Schema<IPasswordResetDocument>(
  {
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
  },
  {timestamps:true}
)

export const PasswordResetModel=mongoose.model<IPasswordResetDocument>(
    'PasswordReset',
    PasswordResetSchema
)