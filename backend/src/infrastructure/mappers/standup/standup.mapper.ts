import { Types } from "mongoose";
import { CreateStandupInput } from "../../../domain/repositories/standup.repository";
import { Standup } from "../../../domain/entities/standup.entity";
import { IStandupDocument } from "../../db/models/standup.model";

export class StandupMapper {

  // ✅ DB → Domain
  static toDomain(doc: IStandupDocument): Standup {
    return new Standup(
      doc._id.toString(),
      doc.projectId.toString(),
      doc.companyId.toString(),
      doc.sprintId.toString(),
      doc.userId.toString(),
      doc.standupDate,
      doc.yesterday,
      doc.today,
      doc.blockers ?? null,
      doc.mood,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: CreateStandupInput | Standup) {
    return {
      projectId: new Types.ObjectId(data.projectId),
      companyId: new Types.ObjectId(data.companyId),
      sprintId: new Types.ObjectId(data.sprintId),
      userId: new Types.ObjectId(data.userId),

      standupDate: data.standupDate,

      yesterday: data.yesterday,
      today: data.today,
      blockers: data.blockers ?? undefined,
      mood: data.mood,
    };
  }
}