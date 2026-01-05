import { Model, UpdateQuery } from "mongoose";

export abstract class BaseRepository<TDocument> {
  protected model: Model<TDocument>;

  constructor(model: Model<TDocument>) {
    this.model = model;
  }


  async updateById(
    id: string,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id);
    return !!res;
  }

  async count(filter: unknown): Promise<number> {
    return this.model.countDocuments(filter as object);
  }

  async exists(filter: unknown): Promise<boolean> {
    return (await this.count(filter)) > 0;
  }
}
