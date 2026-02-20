import { http } from "../../../core/api/http"
import type { DeveloperStandupResponse, StandupMood } from "../types/standup.type";

export const devStandupApi = {
    getmyStandup(projectId: string) {
        return http.get<{ success: boolean; data: DeveloperStandupResponse }>(
            `/developer/projects/${projectId}/standups`
        )
    },

    createStandup(projectId: string, data: {
        yesterday: string;
        today: string;
        blockers?: string | null;
        mood: StandupMood
    }) {
        return http.post<{ success: boolean; message: string }>(
            `/developer/projects/${projectId}/standups`, data
        )
    },

    updateStandup(projectId: string, data: {
        yesterday: string;
        today: string;
        blockers?: string | null;
        mood: StandupMood;

    }){
       return http.put<{success:boolean;message:string}>(
            `/developer/projects/${projectId}/standups`, data
        )
    }
}