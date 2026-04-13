import mongoose from "mongoose";
import { Project, ProjectStatus } from "../../domain/entities/project.entity";
import { FindProjectOptions, IProjectRepository } from "../../domain/repositories/project.repository";
import { ProjectModel } from "../db/models/Project.model";
import { ProjectMapper } from "../mappers/project/project.mapper";

export class ProjectRepository implements IProjectRepository {


    async findByNameInCompany(companyId: string, name: string): Promise<Project | null> {
        const doc = await ProjectModel.findOne({
            companyId,
            name
        })

        return doc ? ProjectMapper.toDomain(doc) : null
    }

    async create(data: Partial<Project>): Promise<Project> {
        const doc = await ProjectModel.create(ProjectMapper.toDocument(data))
        return ProjectMapper.toDomain(doc)
    }
    async findAllByCompany(companyId: string, options: FindProjectOptions): Promise<{ data: Project[]; total: number; }> {
        const { page, limit, search, status, projectIds } = options;
        const query: Record<string, unknown> = {
            companyId
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' }
        }
        if (status) {
            query.status = status
        }

        if (projectIds && projectIds.length > 0) {
            query._id = {
                $in: projectIds.map(id => new mongoose.Types.ObjectId(id))
            };
        }


        const skip = (page - 1) * limit
        const [docs, total] = await Promise.all([
            ProjectModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ProjectModel.countDocuments(query)
        ])

        return {
            data: docs.map(doc =>  ProjectMapper.toDomain(doc)),
            total
        }
    }
    async findById(id: string): Promise<Project | null> {
        const doc = await ProjectModel.findById(id);
        return doc ?  ProjectMapper.toDomain(doc) : null
    }
    async update(projectId: string, data: Partial<Project>): Promise<Project | null> {
        const doc = await ProjectModel.findByIdAndUpdate(
            projectId,
            { $set: ProjectMapper.toDocument(data) },
            { new: true }
        );

        if (!doc) {
            return null;
        }

        return  ProjectMapper.toDomain(doc);
    }

    async delete(projectId: string): Promise<void> {
        await ProjectModel.findByIdAndDelete(projectId)
    }

    async countByCompany(companyId: string): Promise<number> {
        return await ProjectModel.countDocuments({
            companyId: new mongoose.Types.ObjectId(companyId)
        });
    }

    async countByCompanyAndStatus(
        companyId: string,
        status: ProjectStatus
    ): Promise<number> {
        return await ProjectModel.countDocuments({
            companyId: new mongoose.Types.ObjectId(companyId),
            status
        });
    }
}