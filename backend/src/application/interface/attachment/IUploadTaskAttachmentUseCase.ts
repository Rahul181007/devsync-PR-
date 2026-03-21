import { TaskAttachmentResponseDTO } from "../../dto/attachment/taskAttachmentResponse.dto";

export interface IUploadTaskAttachmentUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    taskId: string,
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    }
  ): Promise<TaskAttachmentResponseDTO>;
}