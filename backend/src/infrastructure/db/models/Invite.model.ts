import mongoose, { Schema, Document } from "mongoose";

export interface IInviteDocument extends Document {
  email: string;
  companyId: mongoose.Types.ObjectId;
  role: "COMPANY_ADMIN" | "DEVELOPER";
  invitedBy: mongoose.Types.ObjectId;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: Date;
  createdAt: Date;
}

const inviteSchema = new Schema<IInviteDocument>(
  {
    email: {
      type: String,
      required: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company"
    },
    role: {
      type: String,
      enum: ["COMPANY_ADMIN", "DEVELOPER"],
      required: true
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "EXPIRED"],
      default: "PENDING"
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export const InviteModel = mongoose.model<IInviteDocument>(
  "Invite",
  inviteSchema
);
