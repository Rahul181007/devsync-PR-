import { Standup } from "../../domain/entities/standup.entity";
import { CreateStandupInput, IStandupRepository } from "../../domain/repositories/standup.repository";
import { toUTCDateOnly } from "../../shared/utils/date.util";
import { StandupModel } from "../db/models/standup.model";
import { StandupMapper } from "../mappers/standup/standup.mapper";


type StandupQuery = {
  userId: string;
  sprintId?: string;
  standupDate?: {
    $gte?: Date;
    $lte?: Date;
  };
};


export class StandupRepository implements IStandupRepository {


  async create(data: CreateStandupInput): Promise<Standup> {
    const doc = await StandupModel.create(StandupMapper.toDocument(data))
    return StandupMapper.toDomain(doc)
  }



  async findByUserSprintAndDate(
    userId: string,
    sprintId: string,
    date: Date
  ): Promise<Standup | null> {

    const start = toUTCDateOnly(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const doc = await StandupModel.findOne({
      userId,
      sprintId,
      standupDate: {
        $gte: start,
        $lt: end
      }
    });

    return doc ? StandupMapper.toDomain(doc) : null;
  }

  async findBySprint(sprintId: string): Promise<Standup[]> {
    const docs = await StandupModel.find({ sprintId }).sort({ standupDate: -1 })

    return docs.map(doc => StandupMapper.toDomain(doc))
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

    return docs.map(doc => StandupMapper.toDomain(doc));
  }



  async update(standup: Standup): Promise<Standup> {
    const doc = await StandupModel.findByIdAndUpdate(
      standup.id,
      StandupMapper.toDocument(standup),
      { new: true }
    );

    if (!doc) {
      throw new Error("Standup not found");
    }

    return StandupMapper.toDomain(doc);
  }

  async findBySprintAndDate(
    sprintId: string,
    date: Date
  ): Promise<Standup[]> {

    const start = toUTCDateOnly(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const docs = await StandupModel.find({
      sprintId,
      standupDate: {
        $gte: start,
        $lt: end
      }
    });

    return docs.map(doc => StandupMapper.toDomain(doc));
  }

  async findById(id: string): Promise<Standup | null> {
    const doc = await StandupModel.findById(id);
    if (!doc) return null;
    return StandupMapper.toDomain(doc);
  }
}