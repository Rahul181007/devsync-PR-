import { http } from "../../../core/api/http"
import type { DeveloperTaskBoard, DeveloperTaskDetail, TaskAttachment, TaskComment, TaskStatus } from "../types/task.type";

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
},

getTaskComments(projectId: string, taskId: string) {
  return http.get<{ message: string; data: TaskComment[] }>(
    `/projects/${projectId}/tasks/${taskId}/comments`
  );
},

addTaskComment(projectId: string, taskId: string, message: string) {
  return http.post<{ message: string; data: TaskComment }>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    { message }
  );
},
getTaskAttachments(projectId: string, taskId: string) {
  return http.get<{ data: TaskAttachment[] }>(
    `/projects/${projectId}/tasks/${taskId}/attachments`
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
    `/projects/${projectId}/tasks/${taskId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

};
