import { Invoice } from "../entities/invoice.entity";
export interface CreateInvoiceData {
  companyId: string;
  paymentId: string;
  planId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  invoiceNumber: string;
}
export interface IInvoiceRepositoru {
    create(data: CreateInvoiceData ): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByPaymentId(paymentId: string): Promise<Invoice | null>;
    findByCompany(companyId: string): Promise<Invoice[]>;
}