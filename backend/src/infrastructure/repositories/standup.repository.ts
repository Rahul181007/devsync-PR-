import { Standup } from "../../domain/entities/standup.entity";
import { CreateStandupInput, IStandupRepository } from "../../domain/repositories/standup.repository";
import { IStandupDocument, StandupModel } from "../db/models/standup.model";


type StandupQuery = {
  userId: string;
  sprintId?: string;
  standupDate?: {
    $gte?: Date;
    $lte?: Date;
  };
};


export class StandupRepository implements IStandupRepository {
    private _toDomain(doc: IStandupDocument): Standup {
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
        )
    }

    async create(data: CreateStandupInput): Promise<Standup> {
        const doc =await StandupModel.create({
            projectId:data.projectId,
            companyId:data.companyId,
            sprintId:data.sprintId,
            userId:data.userId,
            standupDate:data.standupDate,
            yesterday:data.yesterday,
            today:data.today,
            blockers:data.blockers?? undefined,
            mood:data.mood
        })
        return this._toDomain(doc)
    }

    async findByUserSprintAndDate(userId: string, sprintId: string, standupDate: Date): Promise<Standup | null> {
        const doc=await StandupModel.findOne({
            userId,
            sprintId,
            standupDate
        })
        return doc?this._toDomain(doc):null
    }

    async findBySprint(sprintId: string): Promise<Standup[]> {
        const docs=await StandupModel.find({sprintId}).sort({standupDate:-1})

        return docs.map(doc=>this._toDomain(doc))
    }

async findByUserWithFilters(
  userId: string,
  filters?: {
    sprintId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<Standup[]> {

  const query: StandupQuery = { userId };

  if (filters?.sprintId) {
    query.sprintId = filters.sprintId;
  }

  if (filters?.startDate || filters?.endDate) {
    query.standupDate = {};

    if (filters.startDate) {
      query.standupDate.$gte = filters.startDate;
    }

    if (filters.endDate) {
      query.standupDate.$lte = filters.endDate;
    }
  }

  const docs = await StandupModel
    .find(query)
    .sort({ standupDate: -1 })
    .lean();

  return docs.map(doc => this._toDomain(doc));
}



     async update(standup: Standup): Promise<Standup> {
    const doc = await StandupModel.findByIdAndUpdate(
      standup.id,
      {
        yesterday: standup.yesterday,
        today: standup.today,
        blockers: standup.blockers,
        mood: standup.mood
      },
      { new: true }
    );

    if (!doc) {
      throw new Error("Standup not found");
    }

    return this._toDomain(doc);
  }
}