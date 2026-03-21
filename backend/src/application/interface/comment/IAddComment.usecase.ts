import { AddCommentRequestDTO } from "../../dto/comment/addCommentRequest.dto";
import { CommentResponseDTO } from "../../dto/comment/commentResponse.dto";

export interface IAddCommentUseCase{
    execute(
        userId:string,
        data:AddCommentRequestDTO
    ):Promise<CommentResponseDTO>
}