import { IGetProjectMessageUseCase } from "../application/interface/chat/IGetProjectMessagesUseCase";
import { ISendMessageUseCase } from "../application/interface/chat/ISendMessageUseCase";
import { GetProjectMessageUseCase } from "../application/use-cases/chat/getProjectMessages.usecase";
import { SendMessageUseCase } from "../application/use-cases/chat/sendMessage.usecase";
import { ChatRepository } from "../infrastructure/repositories/chat.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { ChatController } from "../interfaces/controllers/chat.controller";

const chatRepository=new ChatRepository();
const userRepository=new UserRepository();
const projectRepository=new ProjectRepository();
const projectMemberRepository=new ProjectMemberRepository();

export const sendMessageUseCase:ISendMessageUseCase=new SendMessageUseCase(chatRepository,userRepository,projectRepository,projectMemberRepository);
export const getProjectMessageUseCase:IGetProjectMessageUseCase=new GetProjectMessageUseCase(chatRepository,userRepository,projectRepository,projectMemberRepository);

export const chatController=new ChatController(getProjectMessageUseCase)