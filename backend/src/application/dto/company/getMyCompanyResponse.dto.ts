export interface GetMyCompanyResponse {
  id: string;
  name: string;
  status: 'PENDING'|'APPROVED'|'REJECTED'|"SUSPENDED";
  logoUrl: string | null;
  themeColor: string | null;
}