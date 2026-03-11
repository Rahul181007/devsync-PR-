
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInvoiceRepositoru } from "../../../domain/repositories/invoice.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IInvoiceService } from "../../../domain/service/invoice.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { IGetInvoiceUseCase } from "../../interface/invoice/IGetInvoiceUseCase";

export class GetInvoiceUseCase implements IGetInvoiceUseCase{
    constructor(
        private _invoiveRepo:IInvoiceRepositoru,
        private _userRepo:IUserRepository,
        private _companyRepo:ICompanyRepository,
        private _invoiceService:IInvoiceService
    ){}

    async execute(userId: string, companyId: string, invoiceId: string): Promise<Buffer> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const company=await this._companyRepo.findById(companyId);

        if(!company){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(user.companyId!==company.id){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const invoice=await this._invoiveRepo.findById(invoiceId);

        if(!invoice){
            throw new AppError(
                RESPONSE_MESSAGES.INVOICE.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(invoice.companyId!==company.id){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const pdfBuffer=await this._invoiceService.generate(invoice);
        return pdfBuffer;
    }
}