import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyDocument extends Document {
    name: string;
    slug: string;
    domain: string | null;
    createdBy: 'self' | 'superadmin';
    approvedBy: mongoose.Types.ObjectId | null;
    ownerAdminId: mongoose.Types.ObjectId | null;
    onboardingStep: 'WORKSPACE'| 'BRANDING'| 'PROJECT'| 'DONE';
    logoUrl: string | null;
    themeColor: string | null;
    status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
    currentPlanId: mongoose.Types.ObjectId | null;
    subscriptionId: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    adminEmail: string | null;
}

const companySchema = new Schema<ICompanyDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        domain: {
            type: String,
            unique: true,
            sparse: true,
            default: null
        },
        createdBy: {
            type: String,
            enum: ['self', 'superadmin'],
            default: 'self'
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'SuperAdmin',
            default: null
        },
        ownerAdminId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        onboardingStep: {
            type: String,
            enum: ['WORKSPACE', 'BRANDING', 'PROJECT', 'DONE'],
            default: 'WORKSPACE'
        },
        logoUrl: {
            type: String,
            default: null
        },
        themeColor: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'SUSPENDED'],
            default: "PENDING"
        },
        currentPlanId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            default: null
        },
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: 'Subscription',
            default: null
        },

        adminEmail: {
            type: String,
            default: null
        }

    },
    { timestamps: true }
)

export const CompanyModel = mongoose.model<ICompanyDocument>('Company', companySchema)