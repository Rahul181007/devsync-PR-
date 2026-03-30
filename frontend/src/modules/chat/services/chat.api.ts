import { http } from "../../../core/api/http";
import type { ChatMessagesResponse } from "../types/chat.types";

export const chatApi={
    getProjectMessage(
        projectId:string,
        params?:{
            limit?:number;
            cursor?:string
        }
    ){
        return http.get<ChatMessagesResponse>(`/projects/${projectId}/chat`,{params})
    },
    sendMessage(projectId:string,formData:FormData){
        return http.post(`/projects/${projectId}/chat`,formData)
    }
}