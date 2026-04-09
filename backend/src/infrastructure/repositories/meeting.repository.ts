import { Meeting } from "../../domain/entities/meeting.entity";
import { CreateMeetingData, IMeetingRepository, ListMeetingQuery } from "../../domain/repositories/meeting.repository";
import { IMeetingDocument, MeetingModel } from "../db/models/meeting.model";

export class MeetingRepository implements IMeetingRepository {

    private _toDomain(doc: IMeetingDocument): Meeting {
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
        )
    }

    async create(data: CreateMeetingData): Promise<Meeting> {
        const doc = await MeetingModel.create({
            ...data,
            sprintId: data.sprintId ?? null,
            description: data.description ?? null,
            durationMinutes: data.durationMinutes ?? null,
            meetingLink: data.meetingLink ?? null,
            meetingType: data.meetingType ?? null,
        })
        return this._toDomain(doc)
    }

    async findById(meetingId: string): Promise<Meeting | null> {
        const doc = await MeetingModel.findById(meetingId);
        if (!doc) return null;
        return this._toDomain(doc)
    }

    async findAll(query: ListMeetingQuery): Promise<{ items: Meeting[]; total: number; }> {
        const { page, limit, projectId, sprintId } = query;
        const filter: Record<string, unknown> = { projectId }
        if (sprintId) {
            filter.sprintId = sprintId;
        }
        const items = await MeetingModel.find(filter).skip((page - 1) * limit).limit(limit).sort({ scheduledAt: -1 })
        const total = await MeetingModel.countDocuments(filter)
        return {
            items: items.map(doc => this._toDomain(doc)),
            total
        }

    }

    async save(meeting: Meeting): Promise<void> {
        await MeetingModel.findByIdAndUpdate(meeting.id, {
            title: meeting.title,
            description: meeting.description,
            scheduledAt: meeting.scheduledAt,
            durationMinutes: meeting.durationMinutes,
            meetingLink: meeting.meetingLink,
            meetingType: meeting.meetingType,
            notes: meeting.notes,
            decisions: meeting.decisions,
            status: meeting.status,
        },
    { new: true }
    )
    }

    async findByProject(projectId: string): Promise<Meeting[]> {
        const docs = await MeetingModel.find({ projectId }).sort({ scheduledAt: -1 });
        return docs.map(doc => this._toDomain(doc))
    }

    async findBySprint(sprintId: string): Promise<Meeting[]> {
        const docs = await MeetingModel.find({ sprintId }).sort({ scheduledAt: -1 });
        return docs.map(doc => this._toDomain(doc))
    }

    async updateStatus(meetingId: string, status: "COMPLETED" | "CANCELLED"): Promise<void> {
        await MeetingModel.findByIdAndUpdate(meetingId, { status })
    }
}