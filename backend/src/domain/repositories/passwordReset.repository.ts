import { IPasswordResetDocument } from "../../infrastructure/db/models/passwordReset.model";

export interface IPasswordResetRepository{
    create(data:{
        email:string;
        otp:string,
        expiresAt:Date;
    }):Promise<IPasswordResetDocument>;

    findValidOtp(
        email:string,
        otp:string
    ):Promise<IPasswordResetDocument|null>

    deleteByEmail(email:string):Promise<void>
}