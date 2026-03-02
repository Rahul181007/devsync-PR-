import { IGetProjectAISummaryUseCase } from "../application/interface/ai/IGetProjectAISummaryUseCase";
import { GetProjectAISummaryUseCase } from "../application/use-cases/ai/GetProjectAISummaryUseCase";
import { ProjectAIService } from "../domain/service/project-ai.service";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { AIController } from "../interfaces/controllers/ai.controller";
import { HumanSummaryGenerator } from "../application/service/ai/humanSummaryGenerator";

// Repositories
const projectRepository = new ProjectRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const projectMemberRepository = new ProjectMemberRepository();

// Domain Service
const projectAIService = new ProjectAIService();

const humanSummaryGenerator = new HumanSummaryGenerator();
export const getProjectAISummaryUseCase:IGetProjectAISummaryUseCase=new GetProjectAISummaryUseCase(
    projectRepository,
    taskRepository,
    userRepository,
    projectMemberRepository,
    projectAIService,
    humanSummaryGenerator

)

export const aiController=new AIController(
    getProjectAISummaryUseCase
)