import { ChatMessage } from "../../../domain/entities/chat .entity";
import { GetProjectMessagesRequestDTO } from "../../dto/chat/getProjectMessagesRequest.dto";

export interface IGetProjectMessageUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        query:GetProjectMessagesRequestDTO
    ):Promise<ChatMessage[]>
}