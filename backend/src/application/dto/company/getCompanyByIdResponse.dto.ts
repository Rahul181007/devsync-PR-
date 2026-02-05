export interface GetCompanyByIdResponse {
  id: string;
  name: string;
  slug: string;
  status: string;
  domain?: string | null;
  ownerAdminId?: string | null;
  adminEmail?: string | null;
  hasPendingInvite: boolean;
  admin?: {
    id: string;
    email: string;
    status: string;
  };
}
