import mongoose from "mongoose";
import { Sprint } from "../../domain/entities/sprint.entity";
import { CreateSprintInput, ISprintRepository } from "../../domain/repositories/sprint.repository";
import { ISprintDocument, SprintModel } from "../db/models/sprint.model";

export class SprintRepository implements ISprintRepository {
  private _toDomain(doc: ISprintDocument): Sprint {
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
      doc.stories?.map((id) => id.toString()) ?? []
    )
  }

  async create(data: CreateSprintInput): Promise<Sprint> {
    const doc = await SprintModel.create({
      projectId: data.projectId,
      companyId: data.companyId,
      name: data.name,
      goal: data.goal ?? undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      createdBy: data.createdBy,
      stories: (data.stories ?? []).map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    })
    return this._toDomain(doc)
  }

  async findById(sprintId: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(sprintId);
    return doc ? this._toDomain(doc) : null;

  }

  async findByProjectId(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({ projectId }).sort({ startDate: -1 })
    return docs.map((doc) => this._toDomain(doc))
  }

  async findActiveSprint(projectId: string): Promise<Sprint | null> {
    const doc = await SprintModel.findOne({
      projectId,
      status: "ACTIVE"
    })
    return doc ? this._toDomain(doc) : null
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const doc = await SprintModel.findByIdAndUpdate(
      sprint.id,
      {
        name: sprint.name,
        goal: sprint.goal ?? null,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        stories: sprint.stories
      },
      { new: true }
    );

    if (!doc) {
      throw new Error("Sprint not found");
    }

    return this._toDomain(doc);
  }

  async delete(sprintId: string): Promise<void> {
    await SprintModel.findByIdAndDelete(sprintId);
  }
}