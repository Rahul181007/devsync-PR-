import { http } from "../../../core/api/http";
import type { PlanSprintRequest, SprintDetail, SprintListItems } from "../types/sprint.types";
import type { TaskListItem } from "../types/task.types";

export const sprintApi={
    createSprint(projectId:string,data:{
        name:string;
        goal?:string|null;
        startDate:string;
        endDate:string
    }){
        return http.post<{success:boolean;data:SprintDetail}>(
                  `/company/projects/${projectId}/sprints`,data
        )
    },

    getProjectSprints(projectId:string){
        return http.get<{success:boolean;data:SprintListItems[]}>(
            `/company/projects/${projectId}/sprints`
        )
    },

    getSprintDetail(projectId:string,sprintId:string){
        return http.get<{success:boolean;data:{
            sprint:SprintDetail;
            tasks:TaskListItem[]
        }}>(`/company/projects/${projectId}/sprints/${sprintId}`)
    },

      activateSprint(projectId: string, sprintId: string) {
    return http.patch<{ success: boolean; message: string }>(
      `/company/projects/${projectId}/sprints/${sprintId}/activate`
    );
  },


  completeSprint(projectId: string, sprintId: string) {
    return http.patch<{ success: boolean; message: string }>(
      `/company/projects/${projectId}/sprints/${sprintId}/complete`
    );
  },


  planSprintTasks(projectId: string, data: PlanSprintRequest) {
    return http.patch<{ success: boolean; message: string }>(
      `/company/projects/${projectId}/sprints/plan`,
      data
    );
  }

}