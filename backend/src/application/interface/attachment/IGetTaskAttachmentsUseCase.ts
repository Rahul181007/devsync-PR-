import { TaskAttachmentResponseDTO } from "../../dto/attachment/taskAttachmentResponse.dto";

export interface IGetTaskAttachmentsUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    taskId: string
  ): Promise<TaskAttachmentResponseDTO[]>;
}