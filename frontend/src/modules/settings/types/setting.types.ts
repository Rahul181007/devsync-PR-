export interface ProfileResponse {
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  companyLogo?: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string | null;
}