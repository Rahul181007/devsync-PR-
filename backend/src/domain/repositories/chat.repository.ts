import { ChatMessage } from "../entities/chat.entity";

export interface findMessageOptions{
    limit:number;
    cursor?:string
}

export interface IChatRepository{
    create(data:Partial<ChatMessage>):Promise<ChatMessage>;
    findByProjectId(
        projectId:string,
        options:findMessageOptions
):Promise<ChatMessage[]>

findById(id:string):Promise<ChatMessage|null>
}