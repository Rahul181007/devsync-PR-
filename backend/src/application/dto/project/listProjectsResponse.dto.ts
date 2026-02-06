export type ProjectStatus='ACTIVE'|'ARCHIVED'|'COMPLETED'

export interface ProjectListItem {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  companyId: string;
}

export interface ListProjectsResponse {
  data: ProjectListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}