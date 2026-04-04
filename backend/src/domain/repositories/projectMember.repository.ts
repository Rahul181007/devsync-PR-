export interface IProjectMemberRepository {
    create(data: {
        projectId: string;
        userId: string;
        role: "OWNER" | "DEVELOPER";
    }): Promise<void>

    findUserProjects(userId: string): Promise<string[]>
    isMember(projectId: string, userId: string): Promise<boolean>
    remove(projectId: string, userId: string): Promise<void>
    deleteByProject(projectId: string): Promise<void>
    findMembersByProject(projectId: string): Promise<{
        userId: string;
        role: "OWNER" | "DEVELOPER";
    }[]>;

    countByUser(userId: string): Promise<number>;
}