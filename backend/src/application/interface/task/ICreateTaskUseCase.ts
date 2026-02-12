import { CreateTaskRequestDTO } from "../../dto/task/createTaskRequest.dto";
import { TaskResponseDTO } from "../../dto/task/taskResponse.dto";

export interface ICreateTaskUseCase {
  execute(userId:string,comapnyId:string,projectId:string,data: CreateTaskRequestDTO): Promise<TaskResponseDTO>;
}