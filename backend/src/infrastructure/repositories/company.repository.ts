import { ICompanyRepository, ListCompaniesQuery } from "../../domain/repositories/company.repository";
import { CreateCompanyData } from "../../domain/repositories/company.repository";
import { Company, CompanyStatus, OnboardingStep } from "../../domain/entities/company.entity";
import { CompanyModel } from "../db/models/Company.models";
import { ICompanyDocument } from "../db/models/Company.models";
import { BaseRepository } from "./base.repository";
import { CompanyMapper } from "../mappers/company/company.mapper";

export class CompanyRepository extends BaseRepository<ICompanyDocument> implements ICompanyRepository {
    constructor() {
        super(CompanyModel)
    }
    async findByName(name: string): Promise<Company | null> {
        const companyDoc = await CompanyModel.findOne({ name })
        if (!companyDoc) {
            return null
        }
        return CompanyMapper.toDomain(companyDoc)
    }

    async findByDomain(domain: string): Promise<Company | null> {
        const companyDoc = await CompanyModel.findOne({ domain: domain })
        if (!companyDoc) return null;
        return CompanyMapper.toDomain(companyDoc)
    }

    async create(data: CreateCompanyData): Promise<Company> {
        const doc = await this.model.create(CompanyMapper.toDocument(data))
        return CompanyMapper.toDomain(doc)
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
            items: items.map(val => CompanyMapper.toDomain(val)),
            total
        }
    }

    async updateStatus(companyId: string, status: CompanyStatus, approvedBy?: string): Promise<void> {
        await this.updateById(companyId, CompanyMapper.toDocument({
            status,
            approvedBy
        }))
    }

    async findById(companyId: string): Promise<Company | null> {
        const company = await this.model.findById(companyId);
        if (!company) {
            return null
        } else {
            return CompanyMapper.toDomain(company)
        }
    }

    async assignOwnerAdmin(companyId: string, userId: string): Promise<void> {
        await this.updateById(companyId, CompanyMapper.toDocument({ ownerAdminId: userId }))
    }

    async findByEmail(email: string): Promise<Company | null> {
        const doc = await this.model.findOne({ adminEmail: email });

        if (!doc) return null;

        return CompanyMapper.toDomain(doc);
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

    async save(company: Company): Promise<void> {
        await this.updateById(company.id, {
            status: company.status,
            approvedBy: company.approvedBy ?? null,
            rejectionReason: company.rejectionReason ?? null,
            reviewedAt: company.reviewedAt ?? null
        })
    }

    async updateSubscription(companyId: string, data: { currentPlanId: string; subscriptionId: string; }): Promise<void> {
        await this.updateById(companyId, CompanyMapper.toDocument({
            currentPlanId: data.currentPlanId,
            subscriptionId: data.subscriptionId
        }))
    }

    async countAll(): Promise<number> {
        return this.count({});
    }
    async countByStatus(status: CompanyStatus): Promise<number> {
        return this.count({ status });
    }

    async getPlanDistribution(): Promise<{ plan: string; count: number }[]> {
        const result = await this.model.aggregate([
            {
                $match: {
                    status: "APPROVED",
                    currentPlanId: { $ne: null }
                }
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "currentPlanId",
                    foreignField: "_id",
                    as: "plan"
                }
            },
            {
                $unwind: "$plan"
            },
            {
                $group: {
                    _id: "$plan.name",
                    count: { $sum: 1 }
                }
            }
        ]);

        return result.map((item) => ({
            plan: item._id,
            count: item.count
        }));
    }
}