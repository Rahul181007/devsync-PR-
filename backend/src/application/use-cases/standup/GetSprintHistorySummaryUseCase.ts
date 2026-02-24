import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IStandupRepository } from "../../../domain/repositories/standup.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetSprintHistorySummaryResponseDTO, SprintHistorySummaryItemDTO } from "../../dto/standup/getSprintHistorySummaryResponse.dto";
import { IGetSprintHistorySummaryUseCase } from "../../interface/standup/IGetSprintHistorySummaryUseCase";

export class GetSprintHistorySummaryUseCase implements IGetSprintHistorySummaryUseCase {
    constructor(
        private _standupRepo: IStandupRepository,
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string): Promise<GetSprintHistorySummaryResponseDTO> {
     const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (user.role !== Role.COMPANY_ADMIN) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN
      );
    }

    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError(
        RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (project.companyId !== companyId) {
      throw new AppError(
        RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,
        HttpStatus.FORBIDDEN
      );
    }

    const sprints=await this._sprintRepo.findByProjectId(projectId);

    const members=await this._projectMemberRepo.findMembersByProject(projectId);
    const developerMembers=members.filter((m)=>m.role===Role.DEVELOPER)

    const totalMembers=developerMembers.length;

    const summaryItems:SprintHistorySummaryItemDTO[]=[];

    for(const sprint of sprints){
        const start=new Date(sprint.startDate);
        const end=new Date(sprint.endDate);

        const diffTime=end.getTime()-start.getTime();
        const totalSprintDays=Math.floor(diffTime/(1000*60*60*24))+1

        const totalStandupsExpected=totalSprintDays*totalMembers;

        const sprintStandups=await this._standupRepo.findBySprint(sprint.id);

        const totalStandupsSubmitted=sprintStandups.length;

        const totalStandupsMissed=totalStandupsExpected-totalStandupsSubmitted;

        const completionPercentage=totalStandupsExpected===0?0:Math.round((totalStandupsSubmitted/totalStandupsExpected)*100);

        summaryItems.push({
            sprintId:sprint.id,
            sprintName:sprint.name,
            sprintStatus:sprint.status,
            totalMembers,
            sprintStartDate:sprint.startDate,
            sprintEndDate:sprint.endDate,
            totalSprintDays,
            totalStandupsExpected,
            totalStandupsSubmitted,
            totalStandupsMissed,
            completionPercentage
        })
    }
    return {
        sprints:summaryItems
    }
    }
}