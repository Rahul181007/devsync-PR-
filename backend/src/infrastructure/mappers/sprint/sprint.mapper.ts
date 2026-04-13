import { Types } from "mongoose";
import { CreateSprintInput } from "../../../domain/repositories/sprint.repository";
import { Sprint } from "../../../domain/entities/sprint.entity";
import { ISprintDocument } from "../../db/models/sprint.model";

export class SprintMapper {

  // ✅ DB → Domain
  static toDomain(doc: ISprintDocument): Sprint {
    return new Sprint(
      doc._id.toString(),
      doc.projectId.toString(),
      doc.companyId.toString(),
      doc.name,
      doc.goal ?? null,
      doc.startDate,
      doc.endDate,
      doc.status,
      doc.createdBy.toString(),
      doc.createdAt,
      doc.updatedAt,
      doc.stories?.map(id => id.toString()) ?? []
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: CreateSprintInput | Sprint) {
    return {
      projectId: new Types.ObjectId(data.projectId),
      companyId: new Types.ObjectId(data.companyId),

      name: data.name,
      goal: data.goal ?? undefined,

      startDate: data.startDate,
      endDate: data.endDate,

      status: data.status,

      createdBy: new Types.ObjectId(data.createdBy),

      stories: data.stories
        ? data.stories.map(id => new Types.ObjectId(id))
        : [],
    };
  }
}