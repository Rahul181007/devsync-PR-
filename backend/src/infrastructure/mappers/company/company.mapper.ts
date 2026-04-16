import { Types } from "mongoose";
import { Company } from "../../../domain/entities/company.entity";
import { CreateCompanyData } from "../../../domain/repositories/company.repository";
import { ICompanyDocument } from "../../db/models/Company.models";

export class CompanyMapper {

  // ✅ DB → Domain
  static toDomain(doc: ICompanyDocument): Company {
    return new Company(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.status,
      doc.createdBy,
      doc.onboardingStep,
      doc.ownerAdminId?.toString() ?? undefined,
      doc.domain ?? undefined,
      doc.approvedBy?.toString() ?? undefined,
      doc.rejectionReason ?? undefined,
      doc.reviewedAt ?? undefined,
      doc.logoUrl ?? undefined,
      doc.themeColor ?? undefined,
      doc.currentPlanId?.toString() ?? undefined,
      doc.subscriptionId?.toString() ?? undefined,
      doc.adminEmail ?? undefined
    );
  }

  // ✅ Domain/Input → DB
  static toDocument(data: CreateCompanyData | Partial<Company>) {
    return {
      name: data.name,
      slug: data.slug,
      status: data.status,
      createdBy: data.createdBy,
      onboardingStep: data.onboardingStep,

      domain: data.domain ?? undefined,
      approvedBy: data.approvedBy
        ? new Types.ObjectId(data.approvedBy)
        : undefined,

      ownerAdminId: data.ownerAdminId
        ? new Types.ObjectId(data.ownerAdminId)
        : undefined,

      rejectionReason:
        "rejectionReason" in data ? data.rejectionReason ?? undefined : undefined,

      reviewedAt:
        "reviewedAt" in data ? data.reviewedAt ?? undefined : undefined,

      logoUrl:
        "logoUrl" in data ? data.logoUrl ?? undefined : undefined,

      themeColor:
        "themeColor" in data ? data.themeColor ?? undefined : undefined,

      currentPlanId:
        "currentPlanId" in data && data.currentPlanId
          ? new Types.ObjectId(data.currentPlanId)
          : undefined,

      subscriptionId:
        "subscriptionId" in data
          ? data.subscriptionId ?? undefined
          : undefined,

      adminEmail: data.adminEmail ?? undefined,
    };
  }
}