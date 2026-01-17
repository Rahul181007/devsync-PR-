import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
    companyId: mongoose.Types.ObjectId | null;
    name: string;
    email: string;
    passwordHash: string;
    role: 'COMPANY_ADMIN' | 'DEVELOPER';
    avatarUrl: string | null;
    status: "PENDING_VERIFICATION" | "PENDING_ONBOARDING" | "ACTIVE" | 'BLOCKED';
    authProvider: "LOCAL" | "GOOGLE";
    otp: string | null;
    otpExpiresAt: Date | null
    settings: {
        theme?: string;
        notificationPreferences?: Record<string, unknown>;
    }
    createdAt: Date;
    updatedAt: Date,
    lastLoginAt: Date | null
}

const UserSchema = new Schema<IUserDocument>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            default: null
        },
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['COMPANY_ADMIN', 'DEVELOPER'],
            required: true
        },
        authProvider: {
            type: String,
            enum: ["LOCAL", "GOOGLE"],
            required: true,
        },
        avatarUrl: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ["PENDING_VERIFICATION", "PENDING_ONBOARDING", "ACTIVE", 'BLOCKED'],
            default: "PENDING_VERIFICATION"
        },
        otp: {
            type: String,
            default: null,
        },

        otpExpiresAt: {
            type: Date,
            default: null,
        },
        settings: {
            theme: { type: String, default: "light" },
            notificationPreferences: { type: Object, default: {} },
        },
        lastLoginAt: {
            type: Date,
            default: null
        }

    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema)