export interface SprintResponseDTO {
  id: string;
  projectId: string;
  name: string;
  goal: string | null;
  startDate: Date;
  endDate: Date;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
