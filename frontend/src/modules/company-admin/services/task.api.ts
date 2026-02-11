import { http } from "../../../core/api/http";
import type { TaskListItem, TaskDetail, TaskStatus } from "../types/task.types";


export const taskApi = {
    createTask(projectId: string, data: {
        title: string;
        description: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
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
  }


}