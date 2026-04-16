import { Company } from "../../domain/entities/company.entity";
import { CreateCompanyInput } from "../dto/company/createCompany.dto";

export class CompanyMapper {
  static toDomain(
    input: CreateCompanyInput,
    slug: string,
    normalizedDomain?: string,
    normalizedAdminEmail?: string
  ): Company {
    return new Company(
      "", // id (DB generated)
      input.name,
      slug,
      "APPROVED",
      "superadmin",
      "BRANDING",
      undefined, // ownerAdminId
      normalizedDomain,
      input.createdBySuperAdminId,
      undefined, // rejectionReason
      undefined, // reviewedAt
      undefined, // logoUrl
      undefined, // themeColor
      undefined, // currentPlanId
      undefined, // subscriptionId
      normalizedAdminEmail ?? undefined
    );
  }
}