import { IInvoiceRepositoru } from "../../../domain/repositories/invoice.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IInvoiceService } from "../../../domain/service/invoice.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IGetInvoiceForSuperAdminUseCase } from "../../interface/transaction/IGetInvoiceForSuperAdminUseCase";

export class GetInvoiceForSuperAdminUseCase implements IGetInvoiceForSuperAdminUseCase{
    constructor(
        private _invoiceRepo:IInvoiceRepositoru,
        private _superAdminRepo:ISuperAdminRepository,
        private _invoiceService:IInvoiceService

    ){}

    async execute(userId: string, invoiceId: string): Promise<Buffer> {
        const user=await this._superAdminRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        const invoice = await this._invoiceRepo.findById(invoiceId);
        if(!invoice){
            throw new AppError(RESPONSE_MESSAGES.INVOICE.NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        const pdfBuffer=await this._invoiceService.generate(invoice);
        return pdfBuffer
    }
}