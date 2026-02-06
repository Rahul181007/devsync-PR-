export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';

export interface Project {
    id: string;
    companyId: string;
    name: string;
    slug: string;
    description: string | null;
    status: ProjectStatus;
    startDate: string | null;
    endDate: string | null;
    currentSprintId: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectListData {
    data: {
    data: Project[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };

}

export interface ProjectMember {
  role: "OWNER" | "DEVELOPER";
  user: {
    id: string;
    name: string;
    email: string;
    role: "COMPANY_ADMIN" | "DEVELOPER";
  };
}

export interface ProjectDetail extends Project {
  members: ProjectMember[];
}