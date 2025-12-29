
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { AppError } from "../../../shared/errors/AppError";

export class VerifyInviteUseCase{
    constructor(
        private inviteRepository:IInviteRepository
    ){}

    async execute(token:string){
        const inviteDoc=await this.inviteRepository.findByToken(token)
        if(!inviteDoc){
            throw new AppError('invalid token')
        }
        if(inviteDoc.status!=="PENDING"){
            throw new AppError('its already accepted or expired')
        }
        
        if(inviteDoc.expiresAt.getTime()<Date.now()){
            throw new AppError('invite has already has expired')
        }
        return {
            email:inviteDoc.email,
            role:inviteDoc.role,
            companyId:inviteDoc.companyId
        }
    }
}