import { IGetInvoiceUseCase } from "../application/interface/invoice/IGetInvoiceUseCase";
import { IGetInvoiceForSuperAdminUseCase } from "../application/interface/transaction/IGetInvoiceForSuperAdminUseCase";
import { GetInvoiceUseCase } from "../application/use-cases/invoice/GetInvoiceUseCase";
import { GetInvoiceForSuperAdminUseCase } from "../application/use-cases/transaction/getInvoiceForSuperAdmin.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { InvoiceRepository } from "../infrastructure/repositories/invoice.repository";
import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { PdfInvoiceService } from "../infrastructure/services/pdf/pdfInvoice.service";
import { InvoiceController } from "../interfaces/controllers/invoice.controller";

const invoiceRepository = new InvoiceRepository();
const userRepository = new UserRepository();
const companyRepository = new CompanyRepository();
const superAdminRepo=new SuperAdminRepository()
const invoiceService = new PdfInvoiceService();

const getInvoiceUseCase:IGetInvoiceUseCase = new GetInvoiceUseCase(
  invoiceRepository,
  userRepository,
  companyRepository,
  invoiceService
);

const getInvoiceForSuperAdminUseCase: IGetInvoiceForSuperAdminUseCase =new GetInvoiceForSuperAdminUseCase(invoiceRepository,superAdminRepo,invoiceService)

export const invoiceController = new InvoiceController(
  getInvoiceUseCase,
  getInvoiceForSuperAdminUseCase
);
