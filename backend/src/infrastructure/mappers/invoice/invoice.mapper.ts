import { Types } from "mongoose";
import { CreateInvoiceData } from "../../../domain/repositories/invoice.repository";
import { Invoice } from "../../../domain/entities/invoice.entity";
import { IInvoiceDocument } from "../../db/models/invoice.model";

export class InvoiceMapper {

  // ✅ DB → Domain
  static toDomain(doc: IInvoiceDocument): Invoice {
    return new Invoice(
      doc._id.toString(),
      doc.companyId.toString(),
      doc.paymentId.toString(),
      doc.planId.toString(),
      doc.billingCycle,
      doc.subtotal,
      doc.tax,
      doc.total,
      doc.currency,
      doc.invoiceNumber,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: CreateInvoiceData | Partial<Invoice>) {
    return {
      companyId: new Types.ObjectId(data.companyId),
      paymentId: new Types.ObjectId(data.paymentId),
      planId: new Types.ObjectId(data.planId),

      billingCycle: data.billingCycle,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      currency: data.currency,
      invoiceNumber: data.invoiceNumber,
    };
  }
}