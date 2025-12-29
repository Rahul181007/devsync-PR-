import { IUserRepository } from '../../../domain/repositories/user.repository'
import { LoginDTO } from '../../dto/auth/login.dto'
import { LoginResponseDTO } from '../../dto/auth/login.response.dto'
import { Tokenutilits } from '../../../shared/utils/token.util';
import { IPasswordHasher } from '../../../domain/service/password-hasher';
import { AppError } from '../../../shared/errors/AppError';

export class LoginUserUseCase{
    constructor(
        private userRepo:IUserRepository,
        private passwordHasher:IPasswordHasher

    ){}
   
    async execute(data:LoginDTO):Promise<LoginResponseDTO>{

        const user=await this.userRepo.findByEmail(data.email);
       
        if(!user){
            throw new AppError('Invalid email or password');
        }

        // check password
        const isValid=await this.passwordHasher.compare(data.password,user.passwordHash);
        if(!isValid){
            throw new AppError('Invalid email or password', 400);
        }

        // check status
        if (user.status!=='ACTIVE'){
          throw new AppError('User is not active', 403);
        }

        // only allowed roles like company admin and developer
        if(user.role!=='COMPANY_ADMIN' && user.role!=='DEVELOPER'){
            throw new AppError('Invalid role for this login', 403);
        }

        // update last login
         await this.userRepo.updateLastLogin(user.id, new Date());
        
        // create token payload 
        const payload={
            sub:user.id,
            role:user.role,
            companyId:user.companyId
        }

        const accessToken=Tokenutilits.generateAccessToken(payload);
        const refreshToken=Tokenutilits.generateRefreshToken({sub:user.id,role:user.role});


        return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            accessToken,
            refreshToken
        }
    }

}