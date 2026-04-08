export interface TaskResponseDTO {
  id: string;
  code: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  parentId: string | null;
  sprintId: string | null;

  storyPoints: number; // 👈 important
}