import { env } from "../../../config/env";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { InviteTokenUtil } from "../../../shared/utils/inviteToken.util";
import { CreateInviteInput } from "../../dto/invite/createInvite.dto";

interface InviterContext{
    id:string;
    role:'SUPER_ADMIN'
}
export class CreateInviteUseCase{
    constructor(
        private inviteRepository:IInviteRepository,
        private companyRepo:ICompanyRepository,
        private mailService:IMailService
    ){}

    async execute(input:CreateInviteInput,inviter:InviterContext,companyId:string){
      if(inviter.role!=='SUPER_ADMIN'){
        throw new AppError(RESPONSE_MESSAGES.INVITE.ONLY_SUPER_ADMIN,HttpStatus.FORBIDDEN)
      }
      if(input.role!=='COMPANY_ADMIN'){
        throw new AppError(RESPONSE_MESSAGES.INVITE.INVALID_ROLE,HttpStatus.BAD_REQUEST)
      }
      const company=await this.companyRepo.findById(companyId);
      if(!company){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
      }
      if(company.ownerAdminId){
        throw new AppError(RESPONSE_MESSAGES.INVITE.ALREADY_ASSIGNED,HttpStatus.CONFLICT)
      }
      const existingInvite=await this.inviteRepository.findPendingByEmailAndCompany(input.email,companyId)
      if(existingInvite){
       const newToken=InviteTokenUtil.generateToken();
       const newExipry=InviteTokenUtil.generateExpiry(24);

       const updateInvite=await this.inviteRepository.updateInvite(existingInvite.id,newToken,newExipry) ;
       if(!updateInvite){
        throw new AppError(RESPONSE_MESSAGES.INVITE.CREATE_FAILED,HttpStatus.INTERNAL_SERVER_ERROR)
       }
        const inviteLink=`${env.FRONTEND_URL}/accept-invite?token=${newToken}`;

        await this.mailService.sendCompanyAdminInviteEmail({
          to:existingInvite.email,
          inviteLink
        })

        return {
          id:updateInvite.id,
          email:updateInvite.email,
          expiresAt:updateInvite.expiresAt,
          token:updateInvite.token
        }
      }

      const token =InviteTokenUtil.generateToken();
      const expiresAt=InviteTokenUtil.generateExpiry(24);

      const invite=await this.inviteRepository.create({
        email:input.email,
        companyId,
        role:input.role,
        invitedBy:inviter.id,
        token,
        expiresAt
      })
      if(!invite){
        throw new AppError(RESPONSE_MESSAGES.INVITE.CREATE_FAILED,HttpStatus.INTERNAL_SERVER_ERROR)
      }
      const inviteLink=`${env.FRONTEND_URL}/accept-invite?token=${token}`
      await this.mailService.sendCompanyAdminInviteEmail({
        to:invite.email,
        inviteLink
      })
      return {
        id:invite.id,
        email:invite.email,
        expiresAt:invite.expiresAt,
        token:invite.token
      } 
    }
}