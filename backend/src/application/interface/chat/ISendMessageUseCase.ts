import { ChatMessage } from "../../../domain/entities/chat.entity";
import { SendMessageRequestDTO } from "../../dto/chat/sendMessageRequest.dto";

export interface ISendMessageUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        data:SendMessageRequestDTO
    ):Promise<ChatMessage>
}