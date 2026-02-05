import { UserRole } from "../../../shared/utils/token.util";

export interface DeveloperListItem {
  id: string;
  name: string;
  email: string;
  status: string;
  role: UserRole;
}

export interface ListDevelopersResponse {
  items: DeveloperListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}