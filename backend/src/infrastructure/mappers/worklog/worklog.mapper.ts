import { Types } from "mongoose";
import { Worklog } from "../../../domain/entities/workLog.entity";
import { IWorklogDocument } from "../../db/models/worklog.model";

export class WorklogMapper {


  static toDomain(doc: IWorklogDocument): Worklog {
    return new Worklog(
      doc._id.toString(),
      doc.companyId.toString(),
      doc.projectId.toString(),
      doc.taskId.toString(),
      doc.userId.toString(),
      doc.timeSpent,
      doc.date,
      doc.createdAt,
      doc.updatedAt,
      doc.description ?? undefined
    );
  }


  static toDocument(data: Partial<Worklog>) {
    return {
      companyId: data.companyId
        ? new Types.ObjectId(data.companyId)
        : undefined,

      projectId: data.projectId
        ? new Types.ObjectId(data.projectId)
        : undefined,

      taskId: data.taskId
        ? new Types.ObjectId(data.taskId)
        : undefined,

      userId: data.userId
        ? new Types.ObjectId(data.userId)
        : undefined,

      timeSpent: data.timeSpent,
      date: data.date,
      description: data.description ?? undefined,
    };
  }
}