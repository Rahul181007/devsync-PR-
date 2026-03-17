import { IAddCommentUseCase } from "../application/interface/comment/IAddComment.usecase";
import { IGetTaskCommentsUseCase } from "../application/interface/comment/IGetTaskComments.usecase";
import { AddTaskCommentUseCase } from "../application/use-cases/commnet/addTaskComment.usecase";
import { GetTaskCommentsUseCase } from "../application/use-cases/commnet/getTaskComments.usecase";
import { CommentRepository } from "../infrastructure/repositories/comment.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { TaskCommentController } from "../interfaces/controllers/taskComment.controller";

const commentRepo = new CommentRepository();
const taskRepo = new TaskRepository();
const projectRepo = new ProjectRepository();
const userRepo = new UserRepository();
const projectMemberRepo = new ProjectMemberRepository();

const addCommentUseCase:IAddCommentUseCase = new AddTaskCommentUseCase(commentRepo,taskRepo,projectRepo,projectMemberRepo,userRepo)

const getTaskCommentsUseCase:IGetTaskCommentsUseCase = new GetTaskCommentsUseCase(commentRepo,taskRepo,projectRepo,projectMemberRepo,userRepo);

export const taskCommentController = new TaskCommentController(
  addCommentUseCase,
  getTaskCommentsUseCase
);