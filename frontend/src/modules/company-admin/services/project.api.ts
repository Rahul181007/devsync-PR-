import { http } from "../../../core/api/http";
import type { Project, ProjectDetail, ProjectListData } from "../types/project.types";

interface GetProjectParams {
    page?: number;
    limits?: number;
    search?: string;
    status?: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
}
export const projectApi = {
    createFirstProject(data: { // onboarding project creation
        name: string;
        description?: string;
        startDate?: string;
        endDate?: string;
    }) {
        return http.post("/company/projects/first", data)
    },

    createProject(data: {
        name: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        members?: {
            userId: string
        }[];
    }) {
        return http.post<{ message: string; data: Project }>(
            '/company/projects',
            data
        )
    },
    getProjects(params: GetProjectParams) {
        return http.get<ProjectListData>("/company/projects", { params });
    },
    deleteProject(projectId: string) {
        return http.delete(`/company/projects/${projectId}`);
    },
    getProjectDetail(projectId: string) {
        return http.get<{ message: string; data: ProjectDetail }>(
            `/company/projects/${projectId}`
        )
    },

    removeProjectMember(projectId: string, memberId: string) {
        return http.delete(`/company/projects/${projectId}/members/${memberId}`)
    },

    addProjectMembers(projectId: string, userId: string) {
        return http.post(
            `/company/projects/${projectId}/members`,
            { userId }
        );
    },

    updateProject(projectId: string,
        data: {
            name?: string;
            description?: string;
            startDate?: string | null;
            endDate?: string | null;
            status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
        }

    ) {
        return http.patch<{ message: string; data: ProjectDetail }>(
            `/company/projects/${projectId}`,
            data
        );
    }
}