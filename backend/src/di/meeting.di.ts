
import { ICreateMeetingUseCase } from "../application/interface/meeting/ICreateMeetingUseCase";
import { IGetCompletedMeetingsUseCase } from "../application/interface/meeting/IGetCompletedMeetingUseCase";
import { IGetMeetingsUseCase } from "../application/interface/meeting/IGetMeetingsUseCase";
import { IGetMissedMeetingsUseCase } from "../application/interface/meeting/IGetMissedMeetingsUseCase";
import { IGetTodayMeetingsUseCase } from "../application/interface/meeting/IGetTodayMeetingsUseCase";
import { IUpdateMeetingUsecase } from "../application/interface/meeting/IUpdateMeetingUseCase";
import { CreateMeetingUseCase } from "../application/use-cases/meeting/CreateMeetingUseCase";
import { GetCompletedMeetingsUseCase } from "../application/use-cases/meeting/GetCompletedMeetingsUseCase";
import { GetMeetingsUseCase } from "../application/use-cases/meeting/GetMeetingsUseCase";
import { GetMissedMeetingsUseCase } from "../application/use-cases/meeting/GetMissedMeetingsUseCase";
import { GetTodayMeetingsUseCase } from "../application/use-cases/meeting/GetTodayMeetingsUseCase";
import { UpdateMeetingUseCase } from "../application/use-cases/meeting/UpdateMeetingUseCase";
import { MeetingRepository } from "../infrastructure/repositories/meeting.repository";
import { NotificationRepository } from "../infrastructure/repositories/notification.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { SprintRepository } from "../infrastructure/repositories/sprint.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { MeetingController } from "../interfaces/controllers/meeting.controller";

const userRepository=new UserRepository();
const projectRepository=new ProjectRepository();
const sprintRepo=new SprintRepository();
const meetingRepo=new MeetingRepository();
const projectMemberRepo=new ProjectMemberRepository()
const notificationRepository=new NotificationRepository();

const createMeetingUsecase:ICreateMeetingUseCase=new CreateMeetingUseCase(meetingRepo,userRepository,projectRepository,sprintRepo,projectMemberRepo,notificationRepository);
const getMeetinUseCase:IGetMeetingsUseCase=new GetMeetingsUseCase(meetingRepo,userRepository,projectRepository,projectMemberRepo)
const updateMeetingUseCase: IUpdateMeetingUsecase =
    new UpdateMeetingUseCase(meetingRepo, userRepository, projectRepository);

const getTodayMeetingsUseCase: IGetTodayMeetingsUseCase =
    new GetTodayMeetingsUseCase(
        meetingRepo,
        userRepository,
        projectRepository,
        projectMemberRepo
    );

    const getMissedMeetingsUseCase: IGetMissedMeetingsUseCase =
    new GetMissedMeetingsUseCase(
        meetingRepo,
        userRepository,
        projectRepository,
        projectMemberRepo
    );

        const getCompletedMeetingsUseCase: IGetCompletedMeetingsUseCase =
    new GetCompletedMeetingsUseCase(
        meetingRepo,
        userRepository,
        projectRepository,
        projectMemberRepo
    );
export const meetingController=new MeetingController(
    createMeetingUsecase,
    getMeetinUseCase,updateMeetingUseCase,
    getTodayMeetingsUseCase,
    getMissedMeetingsUseCase,
    getCompletedMeetingsUseCase
)