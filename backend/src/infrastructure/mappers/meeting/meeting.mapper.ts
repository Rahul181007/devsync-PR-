import { Types } from "mongoose";
import { CreateMeetingData } from "../../../domain/repositories/meeting.repository";
import { Meeting } from "../../../domain/entities/meeting.entity";
import { IMeetingDocument } from "../../db/models/meeting.model";

export class MeetingMapper {

 
  static toDomain(doc: IMeetingDocument): Meeting {
    return new Meeting(
      doc._id.toString(),
      doc.projectId.toString(),
      doc.createdBy.toString(),
      doc.sprintId ? doc.sprintId.toString() : null,
      doc.title,
      doc.description ?? null,
      doc.scheduledAt,
      doc.durationMinutes ?? null,
      doc.meetingLink ?? null,
      doc.meetingType ?? null,
      doc.notes ?? null,
      doc.decisions ?? null,
      doc.status,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: CreateMeetingData | Partial<Meeting>) {
    return {
      projectId: new Types.ObjectId(data.projectId),
      createdBy: new Types.ObjectId(data.createdBy),

      sprintId: data.sprintId
        ? new Types.ObjectId(data.sprintId)
        : undefined,

      title: data.title,
      description: data.description ?? undefined,

      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes ?? undefined,

      meetingLink: data.meetingLink ?? undefined,
      meetingType: data.meetingType ?? undefined,

      notes: "notes" in data ? data.notes ?? undefined : undefined,
      decisions: "decisions" in data ? data.decisions ?? undefined : undefined,

      status: "status" in data ? data.status : undefined,
    };
  }
}