import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IPasswordResetRepository } from '../../../domain/repositories/passwordReset.repository';
import { AppError } from '../../../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessages';
import { HttpStatus } from '../../../shared/constants/httpStatus';


export class ResetPasswordUSeCase{
    constructor(
        private _userRepo:IUserRepository,
        private _passwordResetRepo:IPasswordResetRepository
    ){}

    async excute (email:string,newPassword:string){
        const user = await this._userRepo.findByEmail(email);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }        
        //hash pass
        const hashedPassword=await bcrypt.hash(newPassword,10);
   
        // update user Password
        await this._userRepo.updatePassword(user.id,hashedPassword);

        // remove all otps for the email
        await this._passwordResetRepo.deleteByEmail(email)

        return {message:RESPONSE_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS}
    }
}