import { Project } from "../entities/project.entity";

export interface IProjectRepository{
    findByNameInCompany(companyId:string,name:string):Promise<Project|null>;
    create(data:Partial<Project>):Promise<Project>
}