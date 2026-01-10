import { CreateInviteUseCase } from "../../application/use-cases/invite/createInvite.usecase";
import { Request, Response } from "express";
import { inviteSchema } from "../../application/validators/invite/createInvite.validator";
import { handleError } from "../../shared/utils/handleError";
import { verifyInviteQuerySchema } from "../../application/validators/invite/verifyInvite.validator";
import { VerifyInviteUseCase } from "../../application/use-cases/invite/verifyInvite.usecase";
import { acceptInviteQuerySchema } from "../../application/validators/invite/acceptInvite.validator";
import { AcceptInviteUseCase } from "../../application/use-cases/invite/acceptInvite.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { inviteDeveloperSchema } from "../../application/validators/invite/inviteDeveloper.validator";
import { InviteDeveloperUseCase } from "../../application/use-cases/invite/inviteDeveloper.usecase";



export class InviteController {
    constructor(
        private createInviteUseCase: CreateInviteUseCase,
        private verifyInviteUseCase: VerifyInviteUseCase,
        private acceptInviteUseCase:AcceptInviteUseCase,
        private inviteDeveloperUseCase:InviteDeveloperUseCase
    ) { }

    createCompanyAdminInvite = async (req: Request, res: Response) => {
        try {
            const input = inviteSchema.parse(req.body);

            if (!req.user || req.user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json({ message: RESPONSE_MESSAGES.AUTH.FORBIDDEN});

            }

            const inviter = {
                id: req.user.id,
                role: 'SUPER_ADMIN' as const
            }

            const { companyId } = req.params

            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID })
            }

            const result = await this.createInviteUseCase.execute(input, inviter, companyId)


            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.INVITE.SENT,
                data: {
                    id: result.id,
                    email: result.email,
                    expiresAt: result.expiresAt
                }
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
    verifyInvite=async(req:Request,res:Response)=>{
        try {
        const {token}=req.query
        const parsed=verifyInviteQuerySchema.parse({token});
        const result =await this.verifyInviteUseCase.execute(parsed.token)
        res.status(HttpStatus.OK).json({
            message:RESPONSE_MESSAGES.INVITE.VERIFICATION,
            data:result
        })
        } catch (error:unknown) {
            return handleError(error,res)
        }

    }
    acceptInvite=async(req:Request,res:Response)=>{
        try {
            const parsed=acceptInviteQuerySchema.parse(req.body)
            const result =await this.acceptInviteUseCase.execute(parsed)

            res.status(HttpStatus.OK).json({
                success:true,
                data:result
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

     inviteDeveloper=async(req:Request,res:Response)=>{
      try {
                const parsed=inviteDeveloperSchema.parse(req.body);

        if(!req.user || req.user.role!=='COMPANY_ADMIN'){
            return res.status(HttpStatus.FORBIDDEN).json({
                message:RESPONSE_MESSAGES.AUTH.FORBIDDEN
            })
        }

        if(!req.user.companyId){
            return res.status(HttpStatus.BAD_REQUEST).json({
                message:RESPONSE_MESSAGES.COMPANY.NOT_FOUND
            })
        }
        const inviter={
            id:req.user.id,
            role:'COMPANY_ADMIN'as const,
            companyId:req.user.companyId
        }
        const result=await this.inviteDeveloperUseCase.execute({email:parsed.email},inviter)

        return res.status(HttpStatus.CREATED).json({
            message:RESPONSE_MESSAGES.INVITE.SENT,
            data:result
        })
      } catch (error:unknown) {
        return handleError(error,res)
      }
    }
}