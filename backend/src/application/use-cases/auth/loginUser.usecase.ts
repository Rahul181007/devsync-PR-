import bcrypt from 'bcrypt'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { LoginDTO } from '../../dto/auth/login.dto'
import { LoginResponseDTO } from '../../dto/auth/login.response.dto'
import { generateAccessToken,generateRefreshToken } from '../../../shared/utils/token.util';

export class LoginUserUseCase{
    constructor(private userRepo:IUserRepository){}
   
    async execute(data:LoginDTO):Promise<LoginResponseDTO>{

        const user=await this.userRepo.findByEmail(data.email);
       
        if(!user){
            throw new Error('Invalid email or password');
        }

        // check password
        const isValid=await bcrypt.compare(data.password,user.passwordHash);
        if(!isValid){
            throw new Error('Invalid email or password')
        }

        // check status
        if (user.status!=='ACTIVE'){
            throw new Error('User is not active')
        }

        // only allowed roles like company admin and developer
        if(user.role!=='COMPANY_ADMIN' && user.role!=='DEVELOPER'){
            throw new Error('Invalid role  for this login')
        }

        // update last login
         await this.userRepo.updateLastLogin(user.id, new Date());
        
        // create token payload 
        const payload={
            id:user.id,
            email:user.email,
            role:user.role
        }

        const accessToken=generateAccessToken(payload);
        const refreshToken=generateRefreshToken(user.id);


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