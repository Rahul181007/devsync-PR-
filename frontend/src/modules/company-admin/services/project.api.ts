import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
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
        return http.post(API_ROUTES.COMPANY.FIRST_PROJECT, data)
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
            API_ROUTES.COMPANY.PROJECTS,
            data
        )
    },
    getProjects(params: GetProjectParams) {
        return http.get<ProjectListData>( API_ROUTES.COMPANY.PROJECTS, { params });
    },
    deleteProject(projectId: string) {
        return http.delete(API_ROUTES.COMPANY.PROJECT_BY_ID(projectId));
    },
    getProjectDetail(projectId: string) {
        return http.get<{ message: string; data: ProjectDetail }>(
            API_ROUTES.COMPANY.PROJECT_BY_ID(projectId)
        )
    },

    removeProjectMember(projectId: string, memberId: string) {
        return http.delete(API_ROUTES.COMPANY.PROJECT_MEMBER_BY_ID(projectId,memberId))
    },

    addProjectMembers(projectId: string, userId: string) {
        return http.post(
            API_ROUTES.COMPANY.PROJECT_MEMBERS(projectId),
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
            API_ROUTES.COMPANY.PROJECT_BY_ID(projectId),
            data
        );
    }
}