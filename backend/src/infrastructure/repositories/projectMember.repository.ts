import { IProjectMemberRepository } from "../../domain/repositories/projectMember.repository";
import { ProjectMemberModel } from "../db/models/ProjectMember.model";

export class ProjectMemberRepository implements IProjectMemberRepository{
    async create(data: { projectId: string; userId: string; role: "OWNER" |"DEVELOPER"; }): Promise<void> {
        await ProjectMemberModel.create({
            projectId:data.projectId,
            userId:data.userId,
            role:data.role
        })
    }
     async isMember(projectId: string, userId: string): Promise<boolean> {
       const count =await ProjectMemberModel.countDocuments({
        projectId,
        userId
       })    
       return count>0;
    }

    async findUserProjects(userId: string): Promise<string[]> {
        const members=await ProjectMemberModel.find({userId}).select('projectId')
        return members.map(m=>m.projectId.toString())
    }
    async remove(projectId: string, userId: string): Promise<void> {
       await ProjectMemberModel.deleteOne({
        projectId,
        userId
       })
    }

    async deleteByProject(projectId: string): Promise<void> {
        await ProjectMemberModel.deleteMany({
            projectId
        })
    }
}