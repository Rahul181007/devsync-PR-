import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { TaskListItem, TaskDetail, TaskStatus, TaskComment, TaskAttachment } from "../types/task.types";


export const taskApi = {
  createTask(projectId: string, data: {
    title: string;
    description: string;
    type: "EPIC" | "STORY" | "TASK" | "BUG";
    priority: "LOW" | "MEDIUM" | "HIGH";
    parentId?: string | null;
    assigneeId?: string | null;
    dueDate?: string | null
  }) {
    return http.post<{ message: string; data: TaskDetail }>(
      API_ROUTES.COMPANY.TASKS(projectId), data
    )
  },
  getProjectTask(projectId: string) {
    return http.get<{ message: string; data: TaskListItem[] }>(
      API_ROUTES.COMPANY.TASKS(projectId)
    )
  },

  getTaskDetail(projectId: string, taskId: string) {
    return http.get<{ message: string; data: TaskDetail }>(
      API_ROUTES.COMPANY.TASK_BY_ID(projectId, taskId)
    );
  },
  updateTaskStatus(
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) {
    return http.patch<{ message: string; data: TaskDetail }>(
      API_ROUTES.COMPANY.TASK_STATUS(projectId, taskId),
      { status }
    );
  },

  updateTask(
    projectId: string,
    taskId: string,
    data: {
      title?: string
      description?: string
      type?: "EPIC" | "STORY" | "TASK" | "BUG"
      priority?: "LOW" | "MEDIUM" | "HIGH"
      assigneeId?: string | null
      dueDate?: string | null
      estimatedTime?: number | null
      storyPoints?: number | null
    }
  ) {
    return http.patch<{ message: string; data: TaskDetail }>(
      API_ROUTES.COMPANY.TASK_BY_ID(projectId, taskId),
      data
    );
  },


  getTaskComment(projectId: string, taskId: string) {
    return http.get<{ message: string; data: TaskComment[] }>(
      API_ROUTES.COMPANY.TASK_COMMENTS(projectId, taskId)
    );
  },

  addComment(projectId: string, taskId: string, message: string) {
    return http.post<{ message: string; data: TaskComment }>(
      API_ROUTES.COMPANY.TASK_COMMENTS(projectId, taskId),
      { message }
    );
  },

  getTaskAttachments(projectId: string, taskId: string) {
    return http.get<{ data: TaskAttachment[] }>(
      API_ROUTES.COMPANY.TASK_ATTACHMENTS(projectId, taskId)
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
      API_ROUTES.COMPANY.TASK_ATTACHMENTS(projectId, taskId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
}