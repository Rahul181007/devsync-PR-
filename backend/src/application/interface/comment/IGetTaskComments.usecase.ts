import { CommentResponseDTO } from "../../dto/comment/commentResponse.dto";

export interface IGetTaskCommentsUseCase {
  execute(   userId: string,projectId: string,taskId: string): Promise<CommentResponseDTO[]>;
}