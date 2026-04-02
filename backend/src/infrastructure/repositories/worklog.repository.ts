import mongoose from "mongoose";
import { Worklog } from "../../domain/entities/workLog.entity";
import { IWorklogRepository, WorklogWithUser } from "../../domain/repositories/worklog.repository";
import { IWorklogDocument, WorklogModel } from "../db/models/worklog.model";

export class WorklogRepository implements IWorklogRepository {
    private _toDomain(doc: IWorklogDocument): Worklog {
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
            doc.description ?? undefined,
        )

    }

    async create(data: Partial<Worklog>): Promise<Worklog> {
        const doc=await WorklogModel.create({
           companyId:data.companyId,
           projectId:data.projectId,
           taskId:data.taskId,
           userId:data.userId,
           timeSpent:data.timeSpent,
           description:data.description,
           date:data.date, 
        })
        return this._toDomain(doc)
    }

    async findByTaskId(taskId: string): Promise<Worklog[]> {
        const docs=await WorklogModel.find({taskId}).sort({date:-1})
        return docs.map((doc)=>this._toDomain(doc))
    }

      async findByProjectId(projectId: string): Promise<Worklog[]> {
    const docs = await WorklogModel.find({ projectId }).sort({ date: -1 });

    return docs.map((doc) => this._toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Worklog[]> {
    const docs = await WorklogModel.find({ userId }).sort({ date: -1 });

    return docs.map((doc) => this._toDomain(doc));
  }

  async findById(id: string): Promise<Worklog | null> {
    const doc = await WorklogModel.findById(id);

    return doc ? this._toDomain(doc) : null;
  }

  async findByProjectIdWithUser(projectId: string): Promise<WorklogWithUser[]> {
  const docs = await WorklogModel.find({ projectId })
    .populate<{ userId: { _id: string; name: string } }>(
      "userId",
      "name"
    )
        .populate<{ taskId: { _id: string; title: string } }>(
      "taskId",
      "title"
    )
    .sort({ date: -1 });

  return docs.map((doc) => ({
    id: doc._id.toString(),
    taskId: doc.taskId.toString(),

    userId: doc.userId._id.toString(),
    userName: doc.userId.name,
    taskTitle: doc.taskId.title,

    timeSpent: doc.timeSpent,
    description: doc.description ?? undefined,

    date: doc.date,
    createdAt: doc.createdAt,
  }));
}

async update(worklog: Worklog): Promise<Worklog> {
  const doc=await WorklogModel.findByIdAndUpdate(
    worklog.id,
    {
      timeSpent: worklog.timeSpent,
      description: worklog.description,
      date: worklog.date,
    },
     { new: true }
  )
    if (!doc) {
    throw new Error("Worklog not found");
  }

  return this._toDomain(doc);
}

async delete(id: string): Promise<void> {
    const doc = await WorklogModel.findByIdAndDelete(id);

  if (!doc) {
    throw new Error("Worklog not found");
  }
}

async getWorklogTrend(companyId: string): Promise<{ date: string; hours: number; }[]> {
  const last7Days=new Date();
  last7Days.setDate(last7Days.getDate()-7);


  const result=await WorklogModel.aggregate([
    {
      $match:{
        companyId:new mongoose.Types.ObjectId(companyId),
        date:{$gte:last7Days,
          $lte: new Date()
        }
      }
    },
    {
      $group:{
        _id:{
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        },
        hours: { $sum: { $divide: ["$timeSpent", 60] } }
      }
    },
    {
      $sort:{_id:1}
    }
  ])

  return result.map((item)=>({
    date:item._id,
    hours:item.hours
  }))
}
}