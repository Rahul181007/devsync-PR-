export interface CommentResponseDTO{
    id:string;
    taskId:string;
    userId:string;
    message:string;
    createdAt:Date
}

export interface GetCommentResponseDTO{
    id:string;
    taskId:string;
    userId:string;
     userName: string; 
    message:string;
    createdAt:Date
}