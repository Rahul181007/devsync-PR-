
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class VerifyInviteUseCase{
    constructor(
        private inviteRepository:IInviteRepository
    ){}

    async execute(token:string){
        const inviteDoc=await this.inviteRepository.findByToken(token)
        if(!inviteDoc){
            throw new AppError(RESPONSE_MESSAGES.INVITE.INVALID_TOKEN,HttpStatus.CONFLICT)
        }
        if(inviteDoc.status!=="PENDING"){
            throw new AppError(RESPONSE_MESSAGES.INVITE.NOT_PENDING,HttpStatus.BAD_REQUEST)
        }
        
        if(inviteDoc.expiresAt.getTime()<Date.now()){
            throw new AppError(RESPONSE_MESSAGES.INVITE.EXPIRED,HttpStatus.GONE)
        }
        return {
            email:inviteDoc.email,
            role:inviteDoc.role,
            companyId:inviteDoc.companyId
        }
    }
}