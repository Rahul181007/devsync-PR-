import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IPasswordResetRepository } from '../../../domain/repositories/passwordReset.repository';


export class ResetPasswordUSeCase{
    constructor(
        private userRepo:IUserRepository,
        private passwordResetRepo:IPasswordResetRepository
    ){}

    async excute (email:string,newPassword:string){
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }        
        //hash pass
        const hashedPassword=await bcrypt.hash(newPassword,10);
   
        // update user Password
        await this.userRepo.updatePassword(user.id,hashedPassword);

        // remove all otps for the email
        await this.passwordResetRepo.deleteByEmail(email)

        return {message:'Password reset successfully'}
    }
}