export interface CompanyListItem {
  id: string;
  name: string;
  domain?: string | null;
  status: string;
  admin?: {
    id: string;
    email: string;
    status: string;
  };
  hasPendingInvite: boolean;
}

export interface ListCompaniesResponse {
  items: CompanyListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
