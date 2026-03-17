import { http } from "../../../core/api/http";
import type { TaskListItem, TaskDetail, TaskStatus, TaskComment } from "../types/task.types";


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
            `/company/projects/${projectId}/task`, data
        )
    },
    getProjectTask(projectId: string) {
        return http.get<{ message: string; data: TaskListItem[] }>(
            `/company/projects/${projectId}/tasks`
        )
    },

    getTaskDetail(projectId: string, taskId: string) {
        return http.get<{ message: string; data: TaskDetail }>(
            `/company/projects/${projectId}/tasks/${taskId}`
        );
    },
    updateTaskStatus(
        projectId: string,
        taskId: string,
        status: TaskStatus
    ) {
        return http.patch<{ message: string; data: TaskDetail }>(
            `/company/projects/${projectId}/tasks/${taskId}/status`,
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
        }
    ) {
        return http.patch<{ message: string; data: TaskDetail }>(
            `/company/projects/${projectId}/tasks/${taskId}`,
            data
        );
    },


getTaskComment(projectId: string, taskId: string) {
  return http.get<{ message: string; data: TaskComment[] }>(
    `/projects/${projectId}/tasks/${taskId}/comments`
  );
},

addComment(projectId: string, taskId: string, message: string) {
  return http.post<{ message: string; data: TaskComment }>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    { message }
  );
}
}