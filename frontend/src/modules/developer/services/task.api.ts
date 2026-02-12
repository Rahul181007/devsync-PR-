import { http } from "../../../core/api/http"
import type { DeveloperTaskBoard, DeveloperTaskDetail, TaskStatus } from "../types/task.type";

export const devTaskApi = {
  getProjectTask(projectId: string) {
    return http.get<{
      success: boolean;
      data: DeveloperTaskBoard;
    }>(`/developer/projects/${projectId}/tasks`);
  },
  getProjectTaskDetail(projectId:string,taskId:string){
    return http.get<{success:boolean;data:DeveloperTaskDetail}>(
        `/developer/projects/${projectId}/tasks/${taskId}`
    )
  },
  updateTaskStatus(projectId:string,taskId:string,status:TaskStatus){
    return http.patch<{succcess:boolean,message:string}>(
        `/developer/projects/${projectId}/tasks/${taskId}/status`,{status}
    )
  },
  submitTask(
  projectId: string,
  taskId: string,
  data: {
    summary: string;
    workDone: string;
    blockers?: string;
  }
) {
  return http.patch<{ success: boolean; message: string }>(
    `/developer/projects/${projectId}/tasks/${taskId}/submit`,
    data
  );
}



};
