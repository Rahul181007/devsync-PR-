import { Types } from "mongoose";
import { Project } from "../../../domain/entities/project.entity";
import { IProjectDocument } from "../../db/models/Project.model";

export class ProjectMapper {

    // ✅ DB → Domain
    static toDomain(doc: IProjectDocument): Project {
        return new Project(
            doc._id.toString(),
            doc.companyId.toString(),
            doc.name,
            doc.slug,
            doc.description ?? null,
            doc.status,
            doc.startDate ?? null,
            doc.endDate ?? null,
            doc.currentSprintId ? doc.currentSprintId.toString() : null,
            doc.createdBy.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }

    // ✅ Domain → DB
    static toDocument(data: Partial<Project>) {
        return {
            companyId: data.companyId
                ? new Types.ObjectId(data.companyId)
                : undefined,

            name: data.name,
            slug: data.slug,
            description: data.description ?? undefined,
            status: data.status,
            startDate: data.startDate ?? undefined,
            endDate: data.endDate ?? undefined,

            currentSprintId: data.currentSprintId
                ? new Types.ObjectId(data.currentSprintId)
                : undefined,

            createdBy: data.createdBy
                ? new Types.ObjectId(data.createdBy)
                : undefined,
        };
    }
}