import { Invoice } from "../../domain/entities/invoice.entity";
import { CreateInvoiceData, IInvoiceRepositoru } from "../../domain/repositories/invoice.repository";
import { IInvoiceDocument, InvoiceModel } from "../db/models/invoice.model";

export class InvoiceRepository implements IInvoiceRepositoru {
    private _toDomain(doc: IInvoiceDocument): Invoice {
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
        )
    }

    async create(data: CreateInvoiceData): Promise<Invoice> {
        const doc = await InvoiceModel.create(data);
        return this._toDomain(doc);
    }

    async findById(invoiceId: string): Promise<Invoice | null> {
        const doc = await InvoiceModel.findById(invoiceId);
        if (!doc) return null;
        return this._toDomain(doc);
    }

    async findByPaymentId(paymentId: string): Promise<Invoice | null> {
        const doc = await InvoiceModel.findOne({ paymentId });
        if (!doc) return null;
        return this._toDomain(doc);
    }

    async findByCompany(companyId: string): Promise<Invoice[]> {
        const docs = await InvoiceModel.find({ companyId }).sort({ createdAt: -1 });

        return docs.map((doc) => this._toDomain(doc));
    }
}