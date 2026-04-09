import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IStandupRepository } from "../../../domain/repositories/standup.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { toUTCDateOnly } from "../../../shared/utils/date.util";
import { updateStandupRequestDTO } from "../../dto/standup/updateStandupRequest.dto";
import { IUpdateStandupUseCase } from "../../interface/standup/IUpdateStandupUseCase";

export class UpdateStandupUseCase implements IUpdateStandupUseCase{
    constructor(
        private _standupRepo:IStandupRepository,
        private _sprintRepo:ISprintRepository,
        private _projectRepo:IProjectRepository,
        private _userRepo:IUserRepository,
        private _projectMemberRepo:IProjectMemberRepository
    ){}

    async execute(userId: string, companyId: string, projectId: string, data: updateStandupRequestDTO): Promise<void> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(user.role!==Role.DEVELOPER){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const project=await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(project.companyId!==companyId){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,HttpStatus.FORBIDDEN
            )
        }

        const isMember=await this._projectMemberRepo.isMember(projectId,userId)

        if(!isMember){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,HttpStatus.FORBIDDEN)
        }

        if(!project.currentSprintId){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,HttpStatus.BAD_REQUEST)
        }
        const sprint=await this._sprintRepo.findById(project.currentSprintId)
        if(!sprint){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,HttpStatus.NOT_FOUND
            )
        }


        if(sprint.status!=="ACTIVE"){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_ACTIVE,
                HttpStatus.BAD_REQUEST
            )
        }
 


const today = toUTCDateOnly(new Date());
        const standup=await this._standupRepo.findByUserSprintAndDate(
            userId,
            sprint.id,
            today
        )

        if(!standup){
            throw new AppError(RESPONSE_MESSAGES.STANDUP.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
       
        standup.yesterday=data.yesterday;
        standup.today=data.today;
        standup.blockers=data.blockers??null;
        standup.mood=data.mood;
        standup.updatedAt=new Date();

        await this._standupRepo.update(standup)
    }
}