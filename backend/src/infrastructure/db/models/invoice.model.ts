import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceDocument extends Document{
    companyId:mongoose.Types.ObjectId;
    paymentId:mongoose.Types.ObjectId;
    planId:mongoose.Types.ObjectId;

    billingCycle:"MONTHLY" | "YEARLY";
    subtotal:number;
    tax:number;
    total:number;

    currency:string;
    invoiceNumber:string;

    createdAt:Date;
    updatedAt:Date
}

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    billingCycle: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      required: true
    },

    subtotal: {
      type: Number,
      required: true
    },

    tax: {
      type: Number,
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      required: true
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export const InvoiceModel = mongoose.model<IInvoiceDocument>(
  "Invoice",
  invoiceSchema
);