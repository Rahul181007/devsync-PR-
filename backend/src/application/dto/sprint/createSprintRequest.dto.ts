export interface CreateSprintRequestDTO {
  name: string;
  goal?: string | null;
  startDate: Date;
  endDate: Date;
}