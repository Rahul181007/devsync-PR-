import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { LoginDTO } from "../../dto/auth/login.dto";
import bcrypt from 'bcrypt';
import { LoginResponseDTO } from "../../dto/auth/login.response.dto";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token.util";

export class LoginSuperAdminUseCase{
    constructor(private superAdminRepo:ISuperAdminRepository){}

        async execute(data:LoginDTO):Promise<LoginResponseDTO>{

           const superAdmin=await this.superAdminRepo.findByEmail(data.email);
           if(!superAdmin){
            throw new Error ('1..Invalid email or password');
           }
            
           const isPasswordValid=await bcrypt.compare(
            data.password,
            superAdmin.passwordHash
           )

           if(!isPasswordValid){
            throw new Error('invalid email or password');
           }

           // update last login time stamp
           await this.superAdminRepo.updateLastLogin(superAdmin.id,new Date())

           // prepare jwt payload
           const payload={
            id:superAdmin.id,
            email:superAdmin.email,
            role:superAdmin.role
           }

           // generate tokens
           const accessToken=generateAccessToken(payload);
           const refreshToken=generateRefreshToken(superAdmin.id)

           // return clean data not whole entity
           return {
            id:superAdmin.id,
            name:superAdmin.name,
            email:superAdmin.email,
            role:superAdmin.role,
            accessToken,
            refreshToken
           }
        }
     
}