import { Project, ProjectStatus } from "../entities/project.entity";


export interface FindProjectOptions{
    page:number;
    limit:number;
    search?:string;
    status?:ProjectStatus;
    projectIds?:string[]
}
export interface IProjectRepository{
    findByNameInCompany(companyId:string,name:string):Promise<Project|null>;
    create(data:Partial<Project>):Promise<Project>
    findById(id:string):Promise<Project|null>
    findAllByCompany(companyId: string,options: FindProjectOptions): Promise<{ data: Project[]; total: number }>

    update(projectId:string,data:Partial<Project>):Promise<Project|null>
    delete(projectId:string):Promise<void>
}