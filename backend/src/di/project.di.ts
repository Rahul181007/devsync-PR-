import { IAddProjectMemberUseCase } from "../application/interface/project/IAddProjectMemberUseCase";
import { ICreateFirstProjectUseCase } from "../application/interface/project/ICreateFirstProjectUseCase";
import { ICreateProjectUseCase } from "../application/interface/project/ICreateProjectUseCase";
import { IDeleteProjectUseCase } from "../application/interface/project/IDeleteProjectUseCase";
import { IGetProjectDetailUseCase } from "../application/interface/project/IGetProjectDetailUseCase";
import { IListProjectsUseCase } from "../application/interface/project/IListProjectsUseCase";
import { IRemoveProjectMemberUseCase } from "../application/interface/project/IRemoveProjectMemberUseCase";
import { IUpdateProjectUseCase } from "../application/interface/project/IUpdateProjectUseCase";
import { AddProjectMemberUseCase } from "../application/use-cases/project/addProjectMember.usecase";
import { CreateFirstProjectUseCase } from "../application/use-cases/project/createFirstProject.usecase";
import { CreateProjectUseCase } from "../application/use-cases/project/createProject.usecase";
import { DeleteProjectUseCase } from "../application/use-cases/project/deleteProject.usecase";
import { GetProjectDetailUseCase } from "../application/use-cases/project/getProjectDetail.usecase";
import { ListProjectsUseCase } from "../application/use-cases/project/ListProjectsUseCase";
import { RemoveProjectMemberUseCase } from "../application/use-cases/project/removeProjectMember.usecase";
import { UpdateProjectUseCase } from "../application/use-cases/project/updateProject.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";
import { ProjectController } from "../interfaces/controllers/project.controller";

const projectRepository=new ProjectRepository();
const projectMemberRepository=new ProjectMemberRepository();
const companyRepository=new CompanyRepository();
const userRepository=new  UserRepository();
const mailRepo=new NodemailerService();
const createFirstProjectUseCase:ICreateFirstProjectUseCase=new CreateFirstProjectUseCase(projectRepository,projectMemberRepository,companyRepository,userRepository);
const listProjectsUseCase:IListProjectsUseCase=new ListProjectsUseCase(projectRepository,projectMemberRepository,userRepository)
const getProjectDetailUseCase:IGetProjectDetailUseCase= new GetProjectDetailUseCase(projectRepository,projectMemberRepository,userRepository);
const updateProjectUseCase:IUpdateProjectUseCase=new UpdateProjectUseCase(projectRepository,userRepository);
const deleteProjectUseCase:IDeleteProjectUseCase=new DeleteProjectUseCase(projectRepository,userRepository,projectMemberRepository);
const createProjectUseCase:ICreateProjectUseCase=new CreateProjectUseCase(projectRepository,projectMemberRepository,userRepository,companyRepository,mailRepo);
const addProjectMemberUseCase:IAddProjectMemberUseCase=new AddProjectMemberUseCase(projectRepository,projectMemberRepository,userRepository);
const removeProjectMemberUseCase:IRemoveProjectMemberUseCase=new RemoveProjectMemberUseCase(projectRepository,projectMemberRepository,userRepository)
export const projectController=new ProjectController(
    createFirstProjectUseCase,
    listProjectsUseCase,
    getProjectDetailUseCase,
    updateProjectUseCase,
    deleteProjectUseCase,
    createProjectUseCase,
    addProjectMemberUseCase,
    removeProjectMemberUseCase
);