export interface IProjectMemberRepository{
    create(data:{
        projectId:string;
        userId:string;
        role: "OWNER" | "ADMIN" | "DEVELOPER";
    }):Promise<void>
}