import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { DeveloperStandupResponse, StandupMood } from "../types/standup.type";

export const devStandupApi = {
    getmyStandup(projectId: string) {
        return http.get<{ success: boolean; data: DeveloperStandupResponse }>(
            API_ROUTES.DEVELOPER.STANDUPS(projectId)
        )
    },

    createStandup(projectId: string, data: {
        yesterday: string;
        today: string;
        blockers?: string | null;
        mood: StandupMood
    }) {
        return http.post<{ success: boolean; message: string }>(
             API_ROUTES.DEVELOPER.STANDUPS(projectId), data
        )
    },

    updateStandup(projectId: string, data: {
        yesterday: string;
        today: string;
        blockers?: string | null;
        mood: StandupMood;

    }){
       return http.put<{success:boolean;message:string}>(
            API_ROUTES.DEVELOPER.STANDUPS(projectId), data
        )
    }
}