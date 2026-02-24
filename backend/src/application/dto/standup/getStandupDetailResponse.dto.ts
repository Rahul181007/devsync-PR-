export interface GetStandupDetailResponseDTO {
  id: string;
  projectId: string;
  companyId: string;
  sprintId: string;
  userId: string;
  standupDate: Date;
  yesterday: string;
  today: string;
  blockers: string | null;
  mood: string;
  createdAt: Date;
  updatedAt: Date;
}