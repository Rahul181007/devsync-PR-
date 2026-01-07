import { IProjectMemberRepository } from "../../domain/repositories/projectMember.repository";
import { ProjectMemberModel } from "../db/models/ProjectMember.model";

export class ProjectMemberRepository implements IProjectMemberRepository{
    async create(data: { projectId: string; userId: string; role: "OWNER" | "ADMIN" | "DEVELOPER"; }): Promise<void> {
        await ProjectMemberModel.create({
            projectId:data.projectId,
            userId:data.userId,
            role:data.role
        })
    }
}