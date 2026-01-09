import { CreateFirstProjectUseCase } from "../application/use-cases/project/createFirstProject.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { ProjectController } from "../interfaces/controllers/project.controller";

const projectRepository=new ProjectRepository();
const projectMemberRepository=new ProjectMemberRepository();
const companyRepository=new CompanyRepository();
const userRepository=new  UserRepository();

const createFirstProjectUseCase=new CreateFirstProjectUseCase(projectRepository,projectMemberRepository,companyRepository,userRepository);

export const projectController=new ProjectController(createFirstProjectUseCase);