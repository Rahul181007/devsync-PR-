import { Invoice } from "../../domain/entities/invoice.entity";
import { CreateInvoiceData, IInvoiceRepositoru } from "../../domain/repositories/invoice.repository";
import { InvoiceModel } from "../db/models/invoice.model";
import { InvoiceMapper } from "../mappers/invoice/invoice.mapper";

export class InvoiceRepository implements IInvoiceRepositoru {


    async create(data: CreateInvoiceData): Promise<Invoice> {
        const doc = await InvoiceModel.create(InvoiceMapper.toDocument(data));
        return InvoiceMapper.toDomain(doc);
    }

    async findById(invoiceId: string): Promise<Invoice | null> {
        const doc = await InvoiceModel.findById(invoiceId);
        if (!doc) return null;
        return InvoiceMapper.toDomain(doc);
    }

    async findByPaymentId(paymentId: string): Promise<Invoice | null> {
        const doc = await InvoiceModel.findOne({ paymentId });
        if (!doc) return null;
        return InvoiceMapper.toDomain(doc);
    }

    async findByCompany(companyId: string): Promise<Invoice[]> {
        const docs = await InvoiceModel.find({ companyId }).sort({ createdAt: -1 });

        return docs.map((doc) => InvoiceMapper.toDomain(doc));
    }
}