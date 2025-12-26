import { CreateInviteUseCase } from "../../application/use-cases/invite/createInvite.usecase";
import { Request, Response } from "express";
import { inviteSchema } from "../../application/validators/invite/createInvite.validator";
import { handleError } from "../../shared/utils/handleError";
import { verifyInviteQuerySchema } from "../../application/validators/invite/verifyInvite.validator";
import { VerifyInviteUseCase } from "../../application/use-cases/invite/verifyInvite.usecase";
import { acceptInviteQuerySchema } from "../../application/validators/invite/acceptInvite.validator";
import { AcceptInviteUseCase } from "../../application/use-cases/invite/acceptInvite.usecase";



export class InviteController {
    constructor(
        private createInviteUseCase: CreateInviteUseCase,
        private verifyInviteUseCase: VerifyInviteUseCase,
        private acceptInviteUseCase:AcceptInviteUseCase
    ) { }

    createCompanyAdminInvite = async (req: Request, res: Response) => {
        try {
            const input = inviteSchema.parse(req.body);

            if (!req.user || req.user.role !== 'SUPER_ADMIN') {
                return res.status(403).json({ message: "Forbidden" });

            }

            const inviter = {
                id: req.user.id,
                role: 'SUPER_ADMIN' as const
            }

            const { companyId } = req.params

            if (!companyId) {
                return res.status(400).json({ message: 'CompanyId is required' })
            }

            const result = await this.createInviteUseCase.execute(input, inviter, companyId)


            return res.status(201).json({
                message: 'Company admin invited successfully',
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
        res.status(200).json({
            message:'Verification was successful',
            data:result
        })
        } catch (error:unknown) {
            return handleError(error,res,500,'verification failed')
        }

    }
    acceptInvite=async(req:Request,res:Response)=>{
        try {
            const parsed=acceptInviteQuerySchema.parse(req.body)
            const result =await this.acceptInviteUseCase.execute(parsed)

            res.status(200).json({
                success:true,
                data:result
            })
        } catch (error:unknown) {
            return handleError(error,res,500,'Accept invite failed')
        }
    }
}