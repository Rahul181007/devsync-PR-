
export interface ListDevelopersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?:'ACTIVE'|'BLOCKED';
}