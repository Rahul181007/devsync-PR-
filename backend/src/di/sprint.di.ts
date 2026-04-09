import { IActivateSprintUseCase } from "../application/interface/sprint/IActivateSprintUseCase";
import { ICompleteSprintUseCase } from "../application/interface/sprint/ICompleteSprintUseCase";
import { ICreateSprintUseCase } from "../application/interface/sprint/ICreateSprintUseCase";
import { IGetSprintDetailUseCase } from "../application/interface/sprint/IGetSprintDetailUseCase";
import { IListSprintUseCase } from "../application/interface/sprint/IListSprintUseCase";
import { IPlanSprintUseCase } from "../application/interface/sprint/IPlanSprintUseCase";
import { ActivateSprintUseCase } from "../application/use-cases/sprint/ActivateSprintUseCase";
import { CompleteSprintUseCase } from "../application/use-cases/sprint/CompleteSprintUseCase";
import { CreateSprintUseCase } from "../application/use-cases/sprint/CreateSprintUseCase";
import { GetSprintDetailUseCase } from "../application/use-cases/sprint/GetSprintDetailUseCase.tsGetSprintDetailUseCase";
import { ListSprintUseCase } from "../application/use-cases/sprint/ListSprintUseCase";
import { PlanSprintUseCase } from "../application/use-cases/sprint/PlanSprintUseCase";
import { MeetingRepository } from "../infrastructure/repositories/meeting.repository";
import { NotificationRepository } from "../infrastructure/repositories/notification.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { SprintRepository } from "../infrastructure/repositories/sprint.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { SprintController } from "../interfaces/controllers/sprint.controller";

const sprintRepository = new SprintRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository()
const taskRepository = new TaskRepository();
const projectMemberRepository=new ProjectMemberRepository();
const notificationRepository=new NotificationRepository();
const meetingRepo=new MeetingRepository()

const createSprintUseCase: ICreateSprintUseCase = new CreateSprintUseCase(sprintRepository, projectRepository, userRepository,meetingRepo,projectMemberRepository,notificationRepository);
const listSprintUseCase: IListSprintUseCase = new ListSprintUseCase(sprintRepository, userRepository, projectRepository);
const getSprintDetailUseCase: IGetSprintDetailUseCase = new GetSprintDetailUseCase(sprintRepository, projectRepository, taskRepository, userRepository);
const activateSprintUseCase: IActivateSprintUseCase = new ActivateSprintUseCase(sprintRepository, projectRepository, taskRepository, userRepository,projectMemberRepository,notificationRepository)
const completeSprintUseCase:ICompleteSprintUseCase=new CompleteSprintUseCase(sprintRepository,projectRepository,taskRepository,userRepository,projectMemberRepository,notificationRepository,meetingRepo);
const planSprintUseCase:IPlanSprintUseCase=new PlanSprintUseCase(sprintRepository,userRepository,taskRepository)


export const sprintController = new SprintController(
    createSprintUseCase,
    listSprintUseCase,
    getSprintDetailUseCase,
    activateSprintUseCase,
    completeSprintUseCase,
    planSprintUseCase
)