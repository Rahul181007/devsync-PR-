// import jwt from 'jsonwebtoken';
// import { env } from '../../../config/env';
// import { IUserRepository } from '../../../domain/repositories/user.repository';
// import { Tokenutilits } from '../../../shared/utils/token.util';
// import { AppError } from '../../../shared/errors/AppError';
// export class RefreshTokenUseCase{
//     constructor(private userRepo:IUserRepository){}

//     async execute(refreshToken:string){

//             const decoded=jwt.verify(
//                 refreshToken,
//                 env.JWT_REFRESH_SECRET
//             )as jwt.JwtPayload

//         if(!decoded.id){
//             throw new AppError ('Invalid refresh token')
//           }

//             const user =await this.userRepo.findById(decoded.id);

//            if(!user){
//             throw new AppError ('User not found')
//            }

//          const payload ={
//             id:user.id,
//             name:user.name,
//             role:user.role
//          }

//          const newAccessToken=Tokenutilits.generateAccessToken(payload)

//          return {
//             accessToken:newAccessToken,
//             user:{
//                 id:user.id,
//                 name:user.name,
//                 email:user.email,
//                 role:user.role

//             }
//          }


//     }
// }

