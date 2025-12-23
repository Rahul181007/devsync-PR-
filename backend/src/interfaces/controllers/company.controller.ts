import { CreateCompanyUseCase } from "../../application/use-cases/company/createCompany.usecase";
import { Request, Response } from "express";
import { companySchema } from "../../application/validators/company/createCompany.validator";
import { handleError } from "../../shared/utils/handleError";

export class CompanyController {
    constructor(
        private createCompanyUseCase: CreateCompanyUseCase
    ) { }
    createCompany = async (req: Request, res: Response) => {
        try {
            const parsed = companySchema.parse(req.body);
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized"  })
            }
            const superAdminId = req.user.id
            const company = await this.createCompanyUseCase.execute({
                ...parsed,
                createdBySuperAdminId: superAdminId
            })
            res.status(201).json({
                success: true,
                data: company
            })
        } catch (error:unknown) {
           return handleError(error,res,500,'Company creatioin failed')
        }
    }
}