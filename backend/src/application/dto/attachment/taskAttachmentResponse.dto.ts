export interface TaskAttachmentResponseDTO {
  id: string;
  taskId: string;
  projectId: string;

  uploadedBy: string;
  uploadedByName?: string; // optional future

  fileName: string;
  fileUrl: string;

  createdAt: Date;
}