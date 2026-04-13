
import { Sprint } from "../../domain/entities/sprint.entity";
import { CreateSprintInput, ISprintRepository } from "../../domain/repositories/sprint.repository";
import { SprintModel } from "../db/models/sprint.model";
import { SprintMapper } from "../mappers/sprint/sprint.mapper";

export class SprintRepository implements ISprintRepository {


  async create(data: CreateSprintInput): Promise<Sprint> {
    const doc = await SprintModel.create(SprintMapper.toDocument(data))
    return SprintMapper.toDomain(doc)
  }

  async findById(sprintId: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(sprintId);
    return doc ? SprintMapper.toDomain(doc) : null;

  }

  async findByProjectId(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({ projectId }).sort({ startDate: -1 })
    return docs.map((doc) => SprintMapper.toDomain(doc))
  }

  async findActiveSprint(projectId: string): Promise<Sprint | null> {
    const doc = await SprintModel.findOne({
      projectId,
      status: "ACTIVE"
    })
    return doc ? SprintMapper.toDomain(doc) : null
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const doc = await SprintModel.findByIdAndUpdate(
      sprint.id,
      SprintMapper.toDocument(sprint),
      { new: true }
    );

    if (!doc) {
      throw new Error("Sprint not found");
    }

    return SprintMapper.toDomain(doc);
  }

  async delete(sprintId: string): Promise<void> {
    await SprintModel.findByIdAndDelete(sprintId);
  }
}