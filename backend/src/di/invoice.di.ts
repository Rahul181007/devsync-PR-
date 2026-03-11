import { IGetInvoiceUseCase } from "../application/interface/invoice/IGetInvoiceUseCase";
import { GetInvoiceUseCase } from "../application/use-cases/invoice/GetInvoiceUseCase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { InvoiceRepository } from "../infrastructure/repositories/invoice.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { PdfInvoiceService } from "../infrastructure/services/pdf/pdfInvoice.service";
import { InvoiceController } from "../interfaces/controllers/invoice.controller";

const invoiceRepository = new InvoiceRepository();
const userRepository = new UserRepository();
const companyRepository = new CompanyRepository();

const invoiceService = new PdfInvoiceService();

const getInvoiceUseCase:IGetInvoiceUseCase = new GetInvoiceUseCase(
  invoiceRepository,
  userRepository,
  companyRepository,
  invoiceService
);

export const invoiceController = new InvoiceController(
  getInvoiceUseCase
);
