import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IPasswordHasher } from "../../../domain/service/password-hasher";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { SignupDTO } from "../../dto/auth/signup.dto";

export class SignupUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _passwordHasher:IPasswordHasher
    ){}

    async execute(data:SignupDTO){
        const user=await this._userRepo.findByEmail(data.email);

        if(user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_ALREADY_EXISTS,HttpStatus.CONFLICT)
        }

        const passwordHash=await this._passwordHasher.hash(data.password);

       await this._userRepo.create({
        name:data.name,
        email:data.email,
        passwordHash:passwordHash,
        role:'COMPANY_ADMIN',
        status:'PENDING_ONBOARDING',
        companyId:null
       })
    }
}