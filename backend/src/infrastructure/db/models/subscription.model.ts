import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionDocument extends Document {
    companyId: mongoose.Types.ObjectId,
    planId: mongoose.Types.ObjectId,
    status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
    billingCycle: "MONTHLY" | "YEARLY";
    startDate: Date;
    endDate: Date | null;
    renewsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}


const subscriptionSchema=new Schema<ISubscriptionDocument>(
    {
        companyId:{
            type:Schema.Types.ObjectId,
            ref:"Company",
            required:true
        },

        planId:{
            type:Schema.Types.ObjectId,
            ref:"Plan",
            required:true
        },

        status:{
            type:String,
                  enum: ["ACTIVE", "CANCELLED", "EXPIRED", "PENDING"],
      default: "ACTIVE"
        },
        billingCycle:{
            type:String,
                  enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY"
        },
    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      default: null
    },

    renewsAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>(
  "Subscription",
  subscriptionSchema
);