import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { DeveloperTaskBoard, DeveloperTaskDetail, TaskAttachment, TaskComment, TaskStatus } from "../types/task.type";

export const devTaskApi = {
  getProjectTask(projectId: string) {
    return http.get<{
      success: boolean;
      data: DeveloperTaskBoard;
    }>(API_ROUTES.DEVELOPER.TASKS(projectId));
  },
  getProjectTaskDetail(projectId:string,taskId:string){
    return http.get<{success:boolean;data:DeveloperTaskDetail}>(
        API_ROUTES.DEVELOPER.TASK_BY_ID(projectId,taskId)
    )
  },
  updateTaskStatus(projectId:string,taskId:string,status:TaskStatus){
    return http.patch<{succcess:boolean,message:string}>(
        API_ROUTES.DEVELOPER.TASK_STATUS(projectId,taskId),{status}
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
    API_ROUTES.DEVELOPER.SUBMIT_TASK(projectId,taskId),
    data
  );
},

getTaskComments(projectId: string, taskId: string) {
  return http.get<{ message: string; data: TaskComment[] }>(
    API_ROUTES.DEVELOPER.TASK_COMMENTS(projectId,taskId)
  );
},

addTaskComment(projectId: string, taskId: string, message: string) {
  return http.post<{ message: string; data: TaskComment }>(
    API_ROUTES.DEVELOPER.TASK_COMMENTS(projectId,taskId),
    { message }
  );
},
getTaskAttachments(projectId: string, taskId: string) {
  return http.get<{ data: TaskAttachment[] }>(
    API_ROUTES.DEVELOPER.TASK_ATTACHMENTS(projectId,taskId)
  );
},

uploadTaskAttachment(
  projectId: string,
  taskId: string,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  return http.post(
     API_ROUTES.DEVELOPER.TASK_ATTACHMENTS(projectId,taskId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

};
