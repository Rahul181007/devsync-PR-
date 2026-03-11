import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInvoiceRepositoru } from "../../../domain/repositories/invoice.repository";
import { IPaymentRepository } from "../../../domain/repositories/payment.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetPaymentHistoryDTO, GetPaymentHistoryResponseDTO } from "../../dto/payment/getPaymentHistoryDTO";
import { IGetPaymentHistoryUseCase } from "../../interface/payment/IGetPaymentHistoryUseCase";

export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _companyRepo:ICompanyRepository,
        private _paymentRepo:IPaymentRepository,
        private _invoiceRepo:IInvoiceRepositoru,
    ){}

    async execute(data: GetPaymentHistoryDTO): Promise<GetPaymentHistoryResponseDTO[]> {
        const user=await this._userRepo.findById(data.userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const company=await this._companyRepo.findById(data.companyId);
        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(user.companyId!==company.id){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const payments=await this._paymentRepo.findByCompanyId(company.id);

return Promise.all(
  payments.map(async (payment) => {

    const invoice = await this._invoiceRepo.findByPaymentId(payment.id);

    return {
      id: payment.id,
      invoiceId: invoice?.id ?? null,
      amount: payment.amount,
      currency: payment.currency,
      billingCycle: payment.billingCycle,
      status: payment.status,
      createdAt: payment.createdAt
    }

  })
)
    }
}