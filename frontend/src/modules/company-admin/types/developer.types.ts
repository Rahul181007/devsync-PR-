export type DeveloperStatus='ACTIVE'|'BLOCKED'

export interface Developer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: "DEVELOPER";
  status: DeveloperStatus;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}