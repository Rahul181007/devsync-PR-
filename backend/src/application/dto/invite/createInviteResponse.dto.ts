export interface CreateInviteResponse {
  id: string;
  email: string;
  expiresAt: Date;
  token: string;
}
