import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { ChatMessagesResponse } from "../types/chat.types";

export const chatApi={
    getProjectMessage(
        projectId:string,
        params?:{
            limit?:number;
            cursor?:string
        }
    ){
        return http.get<ChatMessagesResponse>(API_ROUTES.COLLAB.PROJECT_CHAT(projectId),{params})
    },
    sendMessage(projectId:string,formData:FormData){
        return http.post(API_ROUTES.COLLAB.PROJECT_CHAT(projectId),formData)
    }
}