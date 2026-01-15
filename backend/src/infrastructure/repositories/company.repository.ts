import { ICompanyRepository, ListCompaniesQuery } from "../../domain/repositories/company.repository";
import { CreateCompanyData } from "../../domain/repositories/company.repository";
import { Company, CompanyStatus, OnboardingStep } from "../../domain/entities/company.entity";
import { CompanyModel } from "../db/models/Company.models";
import { ICompanyDocument } from "../db/models/Company.models";
import { BaseRepository } from "./base.repository";

export class CompanyRepository extends BaseRepository<ICompanyDocument> implements ICompanyRepository {
    constructor() {
        super(CompanyModel)
    }
    private _toEntity(companyDoc: ICompanyDocument): Company { // mapper
        return new Company(

            companyDoc._id.toString(),
            companyDoc.name,
            companyDoc.slug,
            companyDoc.status,
            companyDoc.createdBy,
            companyDoc.onboardingStep,
            companyDoc.ownerAdminId?.toString() ?? undefined,
            companyDoc.domain ?? undefined,
            companyDoc.approvedBy?.toString() ?? undefined,
            companyDoc.logoUrl ?? undefined,
            companyDoc.themeColor ?? undefined,
            companyDoc.currentPlanId?.toString() ?? undefined,
            companyDoc.subscriptionId?.toString() ?? undefined,
            companyDoc.adminEmail ?? undefined
        );

    }
    async findByName(name: string): Promise<Company | null> {
        const companyDoc = await CompanyModel.findOne({ name })
        if (!companyDoc) {
            return null
        }
        return this._toEntity(companyDoc)
    }

    async findByDomain(domain: string): Promise<Company | null> {
        const companyDoc = await CompanyModel.findOne({ domain: domain })
        if (!companyDoc) return null;
        return this._toEntity(companyDoc)
    }

    async create(data: CreateCompanyData): Promise<Company> {
        const doc = await this.model.create(data)
        return this._toEntity(doc)
    }

    async findAll(query: ListCompaniesQuery): Promise<{ items: Company[]; total: number; }> {
        const { page, limit, status, search } = query;
        const filter: Record<string, unknown> = {}
        if (status) {
            filter.status = status
        }
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: 'i' } }, { domain: { $regex: search, $options: 'i' } }]
        }
        const items = await this.model.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
        const total = await this.count(filter)

        return {
            items: items.map(val => this._toEntity(val)),
            total
        }
    }

    async updateStatus(companyId: string, status: CompanyStatus, approvedBy?: string): Promise<void> {
        const update: Record<string, unknown> = { status };
        if (approvedBy) {
            update.approvedBy = approvedBy
        }
        await this.updateById(companyId, update)
    }

    async findById(companyId: string): Promise<Company | null> {
        const company = await this.model.findById(companyId);
        if (!company) {
            return null
        } else {
            return this._toEntity(company)
        }
    }

    async assignOwnerAdmin(companyId: string, userId: string): Promise<void> {
        await this.updateById(companyId, { ownerAdminId: userId })
    }

    async findByEmail(email: string): Promise<Company | null> {
        const doc = await this.model.findOne({ adminEmail: email });

        if (!doc) return null;

        return this._toEntity(doc);
    }
    async updateBranding(companyId: string, data: { logoUrl?: string, themeColor?: string }): Promise<void> {
        if (Object.keys(data).length === 0) {
            return
        }

        await CompanyModel.updateOne({ _id: companyId }, {
            $set: {
                ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
                ...(data.themeColor !== undefined && { themeColor: data.themeColor }),
            },
        })
    }
    async updateOnboardingStep(companyId: string, step: OnboardingStep): Promise<void> {

        await CompanyModel.updateOne(
            { _id: companyId },
            { $set: { onboardingStep: step } }
        );
    }
}