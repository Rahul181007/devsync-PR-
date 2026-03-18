import { IGetTaskAttachmentsUseCase } from "../application/interface/attachment/IGetTaskAttachmentsUseCase";
import { IUploadTaskAttachmentUseCase } from "../application/interface/attachment/IUploadTaskAttachmentUseCase";
import { GetTaskAttachmentsUseCase } from "../application/use-cases/attachment/getTaskAttachments.usecase";
import { UploadTaskAttachmentUseCase } from "../application/use-cases/attachment/uploadTaskAttachment.usecase";
import { TaskAttachmentRepository } from "../infrastructure/repositories/attachment.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { S3FileStorage } from "../infrastructure/services/S3/s3FileStorage.service";
import { TaskAttachmentController } from "../interfaces/controllers/taskAttachment.controller";

const taskAttachmentRepository = new TaskAttachmentRepository();
const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();
const projectMemberRepository = new ProjectMemberRepository();


const fileStorage = new S3FileStorage();


const uploadTaskAttachmentUseCase:IUploadTaskAttachmentUseCase = new UploadTaskAttachmentUseCase(
  taskAttachmentRepository,
  taskRepository,
  projectRepository,
  userRepository,
  projectMemberRepository,
  fileStorage
);

const getTaskAttachmentsUseCase:IGetTaskAttachmentsUseCase= new GetTaskAttachmentsUseCase(
  taskAttachmentRepository,
  taskRepository,
  projectRepository,
  userRepository,
  projectMemberRepository
);


export const taskAttachmentController = new TaskAttachmentController(
  uploadTaskAttachmentUseCase,
  getTaskAttachmentsUseCase
);