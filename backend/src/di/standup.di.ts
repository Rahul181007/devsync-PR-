import { ICreateStandupUseCase } from "../application/interface/standup/ICreateStandupUseCase";
import { IGetMyCurrentSprintStandupsUseCase } from "../application/interface/standup/IGetMyCurrentSprintStandupsUseCase";
import { IGetSprintHistorySummaryUseCase } from "../application/interface/standup/IGetSprintHistorySummaryUseCase";
import { IGetSprintTodayStandupSummaryUseCase } from "../application/interface/standup/IGetSprintTodayStandupSummaryUseCase";
import { IGetStandupDetailForCompanyUseCase } from "../application/interface/standup/IGetStandupDetailForCompanyUseCase";
import { IUpdateStandupUseCase } from "../application/interface/standup/IUpdateStandupUseCase";
import { CreateStandupUseCase } from "../application/use-cases/standup/CreateStandupUseCase";
import { GetMyCurrentSprintStandupsUseCase } from "../application/use-cases/standup/GetMyCurrentSprintStandupsUseCase";
import { GetSprintHistorySummaryUseCase } from "../application/use-cases/standup/GetSprintHistorySummaryUseCase";
import { GetSprintTodayStandupSummaryUseCase } from "../application/use-cases/standup/GetSprintTodayStandupSummaryUseCase";
import { GetStandupDetailForCompanyUseCase } from "../application/use-cases/standup/GetStandupDetailForCompanyUseCase";
import { UpdateStandupUseCase } from "../application/use-cases/standup/UpdateStandupUseCase";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { SprintRepository } from "../infrastructure/repositories/sprint.repository";
import { StandupRepository } from "../infrastructure/repositories/standup.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { StandupController } from "../interfaces/controllers/standup.controller";

const standupRepo = new StandupRepository();
const projectRepo = new ProjectRepository();
const projectMemberRepo = new ProjectMemberRepository();
const userRepo = new UserRepository();
const sprintRepo = new SprintRepository()

const createStandupUseCase: ICreateStandupUseCase = new CreateStandupUseCase(standupRepo, sprintRepo, projectRepo, userRepo, projectMemberRepo)
const getMyCurrentSprintStandupsUseCase: IGetMyCurrentSprintStandupsUseCase = new GetMyCurrentSprintStandupsUseCase(standupRepo, sprintRepo, projectRepo, userRepo, projectMemberRepo)
const updateStandupUseCase: IUpdateStandupUseCase = new UpdateStandupUseCase(standupRepo, sprintRepo, projectRepo, userRepo, projectMemberRepo);
const getSprintTodayStandupSummaryUseCase: IGetSprintTodayStandupSummaryUseCase = new GetSprintTodayStandupSummaryUseCase(
    standupRepo,
    sprintRepo,
    projectRepo,
    userRepo,
    projectMemberRepo
)
const getSprintHistorySummaryUseCase:IGetSprintHistorySummaryUseCase=new GetSprintHistorySummaryUseCase(
    standupRepo,
    sprintRepo,
    projectRepo,
    userRepo,
    projectMemberRepo
)

const getStandupDetailUseCase:IGetStandupDetailForCompanyUseCase=new GetStandupDetailForCompanyUseCase(standupRepo,projectRepo,userRepo)

export const standupController = new StandupController(
    createStandupUseCase,
    getMyCurrentSprintStandupsUseCase,
    updateStandupUseCase,
    getSprintTodayStandupSummaryUseCase,
    getSprintHistorySummaryUseCase,
    getStandupDetailUseCase
)