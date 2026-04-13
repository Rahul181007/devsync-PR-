import { Plan } from "../../../domain/entities/plan.entity";
import { CreatePlanData } from "../../../domain/repositories/plan.repository";
import { IPlanDocument } from "../../db/models/plan.model";

export class PlanMapper {

  // ✅ DB → Domain
  static toDomain(doc: IPlanDocument): Plan {
    return new Plan(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.description,
      doc.pricePerMonth,
      doc.pricePerYear,
      doc.currency,
      doc.features,
      doc.limits,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: CreatePlanData | Partial<Plan>) {
    return {
      name: data.name,
      slug: data.slug,
      description: data.description,
      pricePerMonth: data.pricePerMonth,
      pricePerYear: data.pricePerYear,
      currency: data.currency,
      features: data.features,
      limits: data.limits,
      isActive: data.isActive,
    };
  }
}