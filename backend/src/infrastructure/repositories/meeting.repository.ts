import { Meeting } from "../../domain/entities/meeting.entity";
import { CreateMeetingData, IMeetingRepository, ListMeetingQuery } from "../../domain/repositories/meeting.repository";
import { MeetingModel } from "../db/models/meeting.model";
import { MeetingMapper } from "../mappers/meeting/meeting.mapper";

export class MeetingRepository implements IMeetingRepository {

    async create(data: CreateMeetingData): Promise<Meeting> {
        const doc = await MeetingModel.create(MeetingMapper.toDocument(data))
        return MeetingMapper.toDomain(doc)
    }

    async findById(meetingId: string): Promise<Meeting | null> {
        const doc = await MeetingModel.findById(meetingId);
        if (!doc) return null;
        return MeetingMapper.toDomain(doc)
    }

    async findAll(query: ListMeetingQuery): Promise<{ items: Meeting[]; total: number; }> {
        const { page, limit, projectId, sprintId, type } = query;
        const filter: Record<string, unknown> = { projectId }


        if (sprintId) {
            filter.sprintId = sprintId;
        }

        if (type) {
            if (type === "SPRINT") {
                filter.type = { $in: ["SPRINT_PLANNING", "SPRINT_REVIEW"] };
            } else {
                filter.type = type;
            }

            console.log("QUERY TYPE:", type);
            console.log("FINAL FILTER:", filter);
        }
        const items = await MeetingModel.find(filter).skip((page - 1) * limit).limit(limit).sort({ scheduledAt: -1 })
        const total = await MeetingModel.countDocuments(filter)
        return {
            items: items.map(doc => MeetingMapper.toDomain(doc)),
            total
        }

    }

    async save(meeting: Meeting): Promise<void> {
        await MeetingModel.findByIdAndUpdate(meeting.id, MeetingMapper.toDocument(meeting),
            { new: true }
        )
    }

    async findByProject(projectId: string): Promise<Meeting[]> {
        const docs = await MeetingModel.find({ projectId }).sort({ scheduledAt: -1 });
        return docs.map(doc => MeetingMapper.toDomain(doc))
    }

    async findBySprint(sprintId: string): Promise<Meeting[]> {
        const docs = await MeetingModel.find({ sprintId }).sort({ scheduledAt: -1 });
        return docs.map(doc => MeetingMapper.toDomain(doc))
    }

    async updateStatus(meetingId: string, status: "COMPLETED" | "CANCELLED"): Promise<void> {
        await MeetingModel.findByIdAndUpdate(meetingId, { status })
    }

    async findTodayMeetings(projectId: string): Promise<Meeting[]> {
        const startDate=new Date();
        startDate.setHours(0,0,0,0);
        const endDate=new Date();
        endDate.setHours(23,59,59,999)

        const docs=await MeetingModel.find({
            projectId,
            scheduledAt:{
                $gte:startDate,
                $lte:endDate
            }
        }).sort({scheduledAt:1})

        return docs.map(doc=>MeetingMapper.toDomain(doc))
    }
   async findMissedMeetings(projectId: string): Promise<Meeting[]> {
           const now = new Date();

    const docs = await MeetingModel.find({
        projectId,
        scheduledAt: { $lt: now },
        status: "SCHEDULED"
    }).sort({ scheduledAt: -1 });

    return docs.map(doc => MeetingMapper.toDomain(doc));
   }

   async findCompletedMeetings(projectId: string): Promise<Meeting[]> {
    const docs = await MeetingModel.find({
        projectId,
        status: "COMPLETED"
    }).sort({ scheduledAt: -1 });

    return docs.map(doc => MeetingMapper.toDomain(doc));
}
}