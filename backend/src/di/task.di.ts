import { ICreateTaskUseCase } from "../application/interface/task/ICreateTaskUseCase";
import { IGetProjectTasksUseCase } from "../application/interface/task/IGetBacklogTaskUseCase";
import { IGetDeveloperTaskDetailUseCase } from "../application/interface/task/IGetDeveloperTaskDetailUseCase";
import { IGetDeveloperTasksUseCase } from "../application/interface/task/IGetDeveloperTasksUseCase";
import { IGetTaskDetailUseCase } from "../application/interface/task/IGetTaskDetailUseCase";
import { IPlanSprintTasksUseCase } from "../application/interface/task/IPlanSprintTasksUseCase";
import { ISubmitTaskUseCase } from "../application/interface/task/ISubmitTaskUseCase";
import { IUpdateDeveloperTaskStatusUseCase } from "../application/interface/task/IUpdateDeveloperTaskStatusUseCase";
import { IUpdateTaskStatusUseCase } from "../application/interface/task/IUpdateTaskStatusUseCase";
import { CreateTaskUseCase } from "../application/use-cases/task/createTask.usecase";
import { GetDeveloperTaskDetailUseCase } from "../application/use-cases/task/GetDeveloperTaskDetailUseCase";
import { GetDeveloperTasksUseCase } from "../application/use-cases/task/GetDeveloperTasksUseCase";
import { GetProjectTasksUseCase } from "../application/use-cases/task/GetProjectTasksUseCase";
import { GetTaskDetailUseCase } from "../application/use-cases/task/GetTaskDetailUseCase";
import { PlanSprintTaskUseCase } from "../application/use-cases/task/PlanSprintTasksUseCase";
import { SubmitTaskUseCase } from "../application/use-cases/task/SubmitTaskUseCase";
import { UpdateDeveloperTaskStatusUseCase } from "../application/use-cases/task/UpdateDeveloperTaskStatusUseCase";
import { UpdateTaskStatusUseCase } from "../application/use-cases/task/UpdateTaskStatusUseCase";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { SprintRepository } from "../infrastructure/repositories/sprint.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { TaskController } from "../interfaces/controllers/task.controller";

const projectRepository=new ProjectRepository();
const projectMemberRepository=new ProjectMemberRepository();
const userRepository=new UserRepository();
const taskRepository = new TaskRepository();
const sprintRepository=new SprintRepository()

const createTaskUseCase:ICreateTaskUseCase=new CreateTaskUseCase(taskRepository,userRepository,projectRepository,projectMemberRepository)
const getProjectTasksUseCase:IGetProjectTasksUseCase=new GetProjectTasksUseCase(userRepository,taskRepository,projectRepository)
const getTaskDetailUseCase:IGetTaskDetailUseCase=new GetTaskDetailUseCase(userRepository,projectRepository,taskRepository)
const updateTaskStatusUseCase:IUpdateTaskStatusUseCase=new UpdateTaskStatusUseCase(userRepository,taskRepository,projectRepository);
const getDeveloperTasksUseCase:IGetDeveloperTasksUseCase=new GetDeveloperTasksUseCase(userRepository,taskRepository,projectRepository,projectMemberRepository);
const updateDeveloperTaskUseCase:IUpdateDeveloperTaskStatusUseCase=new UpdateDeveloperTaskStatusUseCase(userRepository,taskRepository,projectRepository,projectMemberRepository);
const submitTaskUseCase:ISubmitTaskUseCase=new SubmitTaskUseCase(userRepository,taskRepository,projectRepository,projectMemberRepository)
const getDeveloperTaskDetailUseCase:IGetDeveloperTaskDetailUseCase=new GetDeveloperTaskDetailUseCase(userRepository,projectRepository,taskRepository,projectMemberRepository);
const planSprintTasksUSeCase:IPlanSprintTasksUseCase=new PlanSprintTaskUseCase(
    taskRepository,
    sprintRepository,
    projectRepository,projectMemberRepository,userRepository
)
export const taskController=new TaskController(createTaskUseCase,
    getProjectTasksUseCase,
    getTaskDetailUseCase,
    updateTaskStatusUseCase,
    getDeveloperTasksUseCase,
    updateDeveloperTaskUseCase,
    submitTaskUseCase,
    getDeveloperTaskDetailUseCase,planSprintTasksUSeCase
)