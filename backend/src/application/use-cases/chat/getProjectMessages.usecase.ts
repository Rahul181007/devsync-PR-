import { ChatMessage } from "../../../domain/entities/chat .entity";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { GetProjectMessagesRequestDTO } from "../../dto/chat/getProjectMessagesRequest.dto";
import { IGetProjectMessageUseCase } from "../../interface/chat/IGetProjectMessagesUseCase";

export class GetProjectMessageUseCase implements IGetProjectMessageUseCase{
    constructor(
        private _chatRepo:IChatRepository,
        private _userRepo:IUserRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository
    ){}
    async execute(userId: string, companyId: string, projectId: string, query: GetProjectMessagesRequestDTO): Promise<ChatMessage[]> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }

        const project=await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(project.companyId!==companyId){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,HttpStatus.FORBIDDEN)
        }

        const isMember=await this._projectMemberRepo.isMember(projectId,userId)
        if(!isMember){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }

        const messages=await this._chatRepo.findByProjectId(
            projectId,
            {
                limit:query.limit,
                cursor:query.cursor
            }
        )
        return messages
    }
}