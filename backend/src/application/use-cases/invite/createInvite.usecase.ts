import { env } from "../../../config/env";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IMailService } from "../../../domain/service/mail.service";
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
        throw new AppError('Only super admin can invite company admin',403)
      }
      if(input.role!=='COMPANY_ADMIN'){
        throw new AppError('Invalid role for invite')
      }
      const company=await this.companyRepo.findById(companyId);
      if(!company){
        throw new AppError('Company not found',404)
      }
      if(company.ownerAdminId){
        throw new AppError('Company admin is already assigned',409)
      }
      const existingInvite=await this.inviteRepository.findPendingByEmail(input.email)
      if(existingInvite){
        throw new AppError('An invite is already pending for this email',409)
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
        throw new AppError('Failed to create invite')
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