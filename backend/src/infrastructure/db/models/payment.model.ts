import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentDocument extends Document {
    companyId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    billingCycle: "MONTHLY" | "YEARLY";
    orderId: string;
    paymentId: string | null;

    amount: number;
    currency: string;

    status: "PENDING" | "SUCCESS" | "FAILED";

    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
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

        orderId: {
            type: String,
            required: true,
            unique: true
        },

        paymentId: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

export const PaymentModel = mongoose.model<IPaymentDocument>(
    "Payment",
    paymentSchema
);