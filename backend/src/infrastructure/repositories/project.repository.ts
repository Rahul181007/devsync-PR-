import { Project } from "../../domain/entities/project.entity";
import { IProjectRepository } from "../../domain/repositories/project.repository";
import { IProjectDocument, ProjectModel } from "../db/models/Project.model";

export class ProjectRepository implements IProjectRepository {
    private toDomain(doc:IProjectDocument):Project {
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

        return doc?this.toDomain(doc):null
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
        return this.toDomain(doc)
    }
}