import { Project } from "../../domain/entities/project.entity";
import { CreateProjectWithMembersDTO } from "../dto/project/createProjectWithMembers.dto";

export class ProjectMapper {
  static toDomain(
    companyId: string,
    userId: string,
    dto: CreateProjectWithMembersDTO,
    slug: string
  ): Project {
    const now = new Date();

    return new Project(
      "", // id (db will generate)
      companyId,
      dto.name,
      slug,
      dto.description ?? null,
      "ACTIVE",
      dto.startDate ?? null,
      dto.endDate ?? null,
      null, // currentSprintId
      userId,
      now,
      now
    );
  }
}