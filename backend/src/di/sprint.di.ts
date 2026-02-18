import { IActivateSprintUseCase } from "../application/interface/sprint/IActivateSprintUseCase";
import { ICompleteSprintUseCase } from "../application/interface/sprint/ICompleteSprintUseCase";
import { ICreateSprintUseCase } from "../application/interface/sprint/ICreateSprintUseCase";
import { IGetSprintDetailUseCase } from "../application/interface/sprint/IGetSprintDetailUseCase";
import { IListSprintUseCase } from "../application/interface/sprint/IListSprintUseCase";
import { ActivateSprintUseCase } from "../application/use-cases/sprint/ActivateSprintUseCase";
import { CompleteSprintUseCase } from "../application/use-cases/sprint/CompleteSprintUseCase";
import { CreateSprintUseCase } from "../application/use-cases/sprint/CreateSprintUseCase";
import { GetSprintDetailUseCase } from "../application/use-cases/sprint/GetSprintDetailUseCase.tsGetSprintDetailUseCase";
import { ListSprintUseCase } from "../application/use-cases/sprint/ListSprintUseCase";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { SprintRepository } from "../infrastructure/repositories/sprint.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { SprintController } from "../interfaces/controllers/sprint.controller";

const sprintRepository = new SprintRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository()
const taskRepository = new TaskRepository()
const createSprintUseCase: ICreateSprintUseCase = new CreateSprintUseCase(sprintRepository, projectRepository, userRepository);
const listSprintUseCase: IListSprintUseCase = new ListSprintUseCase(sprintRepository, userRepository, projectRepository);
const getSprintDetailUseCase: IGetSprintDetailUseCase = new GetSprintDetailUseCase(sprintRepository, projectRepository, taskRepository, userRepository);
const activateSprintUseCase: IActivateSprintUseCase = new ActivateSprintUseCase(sprintRepository, projectRepository, taskRepository, userRepository)
const completeSprintUseCase:ICompleteSprintUseCase=new CompleteSprintUseCase(sprintRepository,projectRepository,taskRepository,userRepository)
export const sprintController = new SprintController(
    createSprintUseCase,
    listSprintUseCase,
    getSprintDetailUseCase,
    activateSprintUseCase,
    completeSprintUseCase
)