import mongoose from "mongoose";
import { Project } from "../../domain/entities/project.entity";
import { FindProjectOptions, IProjectRepository } from "../../domain/repositories/project.repository";
import { IProjectDocument, ProjectModel } from "../db/models/Project.model";

export class ProjectRepository implements IProjectRepository {
    private _toDomain(doc:IProjectDocument):Project {
        return new Project(
            doc._id.toString(),
            doc.companyId.toString(),
            doc.name,
            doc.slug,
            doc.description??null,
            doc.status,
            doc.startDate??null,
            doc.endDate??null,
            doc.currentSprintId?doc.currentSprintId.toString():null,
            doc.createdBy.toString(),
            doc.createdAt,
            doc.updatedAt
        )
    }

    async findByNameInCompany(companyId: string, name: string): Promise<Project | null> {
        const doc=await ProjectModel.findOne({
            companyId,
            name
        })

        return doc?this._toDomain(doc):null
    }

    async create(data:Partial<Project>):Promise<Project>{
        const doc=await ProjectModel.create({
            companyId:data.companyId,
            name:data.name,
            slug:data.slug,
            description:data.description,
            status:data.status,
            startDate:data.startDate,
            endDate:data.endDate,
            createdBy:data.createdBy

        } as Partial<IProjectDocument>)
        return this._toDomain(doc)
    }
    async findAllByCompany(companyId: string, options: FindProjectOptions): Promise<{ data: Project[]; total: number; }> {
       const {page,limit,search,status,projectIds}=options;
       const query:Record<string,unknown>={
        companyId
       }
       if(search){
        query.name={$regex:search,$options:'i'}
       }
       if(status){
        query.status=status
       }

if (projectIds && projectIds.length > 0) {
  query._id = {
    $in: projectIds.map(id => new mongoose.Types.ObjectId(id))
  };
}


       const skip=(page-1)*limit
       const [docs,total]=await Promise.all([
        ProjectModel.find(query)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit),
        ProjectModel.countDocuments(query)
       ])

       return {
        data:docs.map(doc=>this._toDomain(doc)),
        total
       }
    }
  async findById(id: string): Promise<Project | null> {
        const doc=await ProjectModel.findById(id);
        return doc?this._toDomain(doc):null
    }
async update(projectId: string, data: Partial<Project>): Promise<Project | null> {
  const doc = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $set: data },
    { new: true }
  );

  if (!doc) {
    return null;
  }

  return this._toDomain(doc);
}
 
    async delete(projectId: string): Promise<void> {
        await ProjectModel.findByIdAndDelete(projectId)
    }
}