import { Comment } from "../entities/comments.entity";

export interface CommentWithUser  {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: Date;
};
export interface ICommentRepository{
    create(comment:{
        taskId:string;
        userId:string;
        message:string;
    }):Promise<Comment>

    findByTaskId(taskId:string):Promise<Comment[]>

    findByTaskIdWithUser(taskId: string): Promise<CommentWithUser[]>;
}