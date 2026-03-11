import { ICreatePaymentUseCase } from "../application/interface/payment/ICreatePaymentUseCase";
import { IGetPaymentHistoryUseCase } from "../application/interface/payment/IGetPaymentHistoryUseCase";
import { IVerifyPaymentUseCase } from "../application/interface/payment/IVerifyPaymentUseCase";
import { CreatePaymentUseCase } from "../application/use-cases/payment/createPayment.usecase";
import { GetPaymentHistoryUseCase } from "../application/use-cases/payment/getPaymentHistoryUseCase";
import { VerifyPaymentUseCase } from "../application/use-cases/payment/verifyPayment.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { InvoiceRepository } from "../infrastructure/repositories/invoice.repository";
import { PaymentRepository } from "../infrastructure/repositories/payment.repository";
import { PlanRepository } from "../infrastructure/repositories/plan.repository";
import { SubscriptionRepository } from "../infrastructure/repositories/subscription.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { RazorpayService } from "../infrastructure/services/razorpay/razorpay.service";
import { PaymentController } from "../interfaces/controllers/payment.controller";

const userRepo=new UserRepository();
const companyRepo=new CompanyRepository();
const planRepo=new PlanRepository();
const paymentRepo=new PaymentRepository();
const razorpayService=new RazorpayService();
const subscriptionRepo=new SubscriptionRepository()
const invoiceRepo=new InvoiceRepository()

const createPaymentUseCase:ICreatePaymentUseCase=new CreatePaymentUseCase(
    userRepo,
    companyRepo,
    planRepo,
    paymentRepo,
    razorpayService,
    subscriptionRepo
)
const verifyPaymentUseCase:IVerifyPaymentUseCase=new VerifyPaymentUseCase(paymentRepo,subscriptionRepo,companyRepo,razorpayService,invoiceRepo)
const getPaymentHistoryUseCase:IGetPaymentHistoryUseCase=new GetPaymentHistoryUseCase(userRepo,companyRepo,paymentRepo,invoiceRepo)
export const paymentController=new PaymentController(
    createPaymentUseCase,
    verifyPaymentUseCase,
    getPaymentHistoryUseCase
)