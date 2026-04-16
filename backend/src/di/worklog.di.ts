import { ICreateWorklogUseCase } from "../application/interface/worklog/ICreateWorklogUseCase";
import { IDeleteWorklogUseCase } from "../application/interface/worklog/IDeleteWorklogUseCase";
import { IGetTimesheetByProjectUseCase } from "../application/interface/worklog/IGetTimesheetByProjectUseCase";
import { IGetWorklogsByProjectUseCase } from "../application/interface/worklog/IGetWorklogsByProjectUseCase";
import { IGetWorklogsByTaskUseCase1 } from "../application/interface/worklog/IGetWorklogsByTaskUseCase";
import { IUpdateWorklogUseCase } from "../application/interface/worklog/IUpdateWorklogUseCase";
import { CreateWorklogUseCase } from "../application/use-cases/worklog/createWorklog.usecase";
import { DeleteWorklogUseCase } from "../application/use-cases/worklog/deleteWorklogUseCase";
import { GetTimesheetByProjectUseCase } from "../application/use-cases/worklog/getTimesheetByProject.usecase";
import { GetWorklogsByProjectUseCase } from "../application/use-cases/worklog/getWorklogByProject.usecase";
import { GetWorklogsByTaskUseCase } from "../application/use-cases/worklog/getWorklogbyTask.usecasde";
import { UpdateWorklogUseCase } from "../application/use-cases/worklog/updateWorklogUseCase";
import { MeetingRepository } from "../infrastructure/repositories/meeting.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { WorklogRepository } from "../infrastructure/repositories/worklog.repository";
import { WorklogController } from "../interfaces/controllers/worklog.controller";

const worklogRepository = new WorklogRepository();
const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();
const projectMemberRepository = new ProjectMemberRepository();
const meetingRepo=new MeetingRepository()

const createWorklogUseCase:ICreateWorklogUseCase = new CreateWorklogUseCase(worklogRepository,taskRepository,projectMemberRepository,projectRepository,userRepository);

const getWorklogsByTaskUseCase:IGetWorklogsByTaskUseCase1= new GetWorklogsByTaskUseCase(
  worklogRepository,
  taskRepository,
  projectMemberRepository,
  projectRepository,
  userRepository
);

const getWorklogsByProjectUseCase :IGetWorklogsByProjectUseCase= new GetWorklogsByProjectUseCase(
  worklogRepository,
  projectMemberRepository,
  projectRepository,
  userRepository
);

const updateWorklogUseCase:IUpdateWorklogUseCase=new UpdateWorklogUseCase(
    worklogRepository,
    projectRepository,
    projectMemberRepository,
    userRepository,
    taskRepository
);

const deleteWorklogUsecase:IDeleteWorklogUseCase=new DeleteWorklogUseCase(
    worklogRepository,
    projectRepository,
    projectMemberRepository,
    userRepository,
    taskRepository
)

const getTimesheetByProjectUsecase:IGetTimesheetByProjectUseCase=new GetTimesheetByProjectUseCase(
  worklogRepository,
  projectMemberRepository,
  projectRepository,
  userRepository,
  meetingRepo

)

export const worklogController = new WorklogController(
  createWorklogUseCase,
  getWorklogsByTaskUseCase,
  getWorklogsByProjectUseCase,
  updateWorklogUseCase,
  deleteWorklogUsecase,
  getTimesheetByProjectUsecase
);