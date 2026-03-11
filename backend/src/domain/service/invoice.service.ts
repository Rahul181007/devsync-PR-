import { Invoice } from "../entities/invoice.entity";

export interface IInvoiceService {
    generate(invoice: Invoice): Promise<Buffer>;
}