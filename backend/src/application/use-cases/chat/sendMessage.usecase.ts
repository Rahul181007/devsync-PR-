import { ChatMessage } from "../../../domain/entities/chat .entity";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { SendMessageRequestDTO } from "../../dto/chat/sendMessageRequest.dto";
import { ISendMessageUseCase } from "../../interface/chat/ISendMessageUseCase";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _projectMemberRepe: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, data: SendMessageRequestDTO): Promise<ChatMessage> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,
                HttpStatus.FORBIDDEN
            )
        }

        if (project.status !== "ACTIVE") {
            throw new AppError(
                "Cannot send messages in completed or archived project",
                HttpStatus.BAD_REQUEST
            );
        }

        const isMember = await this._projectMemberRepe.isMember(projectId, userId)

        if (!isMember) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }

        if (data.replyToMessageId) {
            const replyMessage = await this._chatRepo.findById(data.replyToMessageId)
            if (!replyMessage) {
                throw new AppError(
                    RESPONSE_MESSAGES.CHAT.REPLY_MESSAGE_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                )
            }
        }
        const created = await this._chatRepo.create({
            projectId,
            senderId: userId,
            senderName:user.name,
            message: data.message,
            replyToMessageId: data.replyToMessageId ?? null
        })

        return created
    }
}