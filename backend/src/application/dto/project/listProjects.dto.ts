export type ProjectStatus='ACTIVE'|'ARCHIVED'|'COMPLETED'

export interface ListProjectsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: ProjectStatus;
}