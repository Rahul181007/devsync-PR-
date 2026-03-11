import mongoose, { Schema, Document } from "mongoose";

export interface IPlanDocument extends Document {
    name: string;
    slug: string;
    description: string;
    pricePerMonth: number;
    pricePerYear: number;
    currency: 'USD' | 'INR' | 'EUR';
    features: string[];
    limits: {
        maxProjects: number;
        maxDevelopers: number;
        maxStorageGB: number;
    },
    isActive: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const planSchema = new Schema<IPlanDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        pricePerMonth: {
            type: Number,
            required: true,
        },
        pricePerYear: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            enum: ['USD', 'INR', 'EUR'],
            default: 'INR'
        },
        features: {
            type: [String],
            default: []
        },

        limits: {
            maxProjects: {
                type: Number,
                required: true
            },
            maxDevelopers: {
                type: Number,
                required: true
            },
            maxStorageGB: {
                type: Number,
                required: true
            }
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isDefault: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
)

export const PlanModel = mongoose.model<IPlanDocument>('Plan', planSchema);