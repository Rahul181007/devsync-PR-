import { Types } from "mongoose";
import { CreateSubscriptionData } from "../../../domain/repositories/subscription.repository";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { ISubscriptionDocument } from "../../db/models/subscription.model";

export class SubscriptionMapper {

  // ✅ DB → Domain
  static toDomain(doc: ISubscriptionDocument): Subscription {
    return new Subscription(
      doc._id.toString(),
      doc.companyId.toString(),
      doc.planId.toString(),
      doc.status,
      doc.billingCycle,
      doc.startDate,
      doc.endDate ?? null,
      doc.renewsAt ?? null,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: CreateSubscriptionData | Partial<Subscription>) {
    return {
      companyId: data.companyId
        ? new Types.ObjectId(data.companyId)
        : undefined,

      planId: data.planId
        ? new Types.ObjectId(data.planId)
        : undefined,

      status: data.status,
      billingCycle: data.billingCycle,

      startDate: data.startDate,
      endDate: data.endDate ?? undefined,
      renewsAt: data.renewsAt ?? undefined,
    };
  }
}