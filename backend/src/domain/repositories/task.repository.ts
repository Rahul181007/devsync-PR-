import { Task, TaskPriority, TaskStatus, TaskType } from "../entities/task.entity";
export interface CreateTaskInput {
    companyId: string;
    projectId: string;
    sprintId: string | null;
    parentId?: string | null
    code: string;

    title: string;
    description: string;
    type?: TaskType

    status: TaskStatus;
    priority: TaskPriority;
    estimatedTime?: number | null;
    storyPoints?:number|null

    reporterId: string;
    assigneeId?: string | null;

    dueDate?: Date | null
}
export interface ITaskRepository {
    create(task: CreateTaskInput): Promise<Task>;

    findById(taskId: string): Promise<Task | null>;

    findByProjectId(projectId: string): Promise<Task[]>;

    findBacklogTasks(projectId: string): Promise<Task[]>;

    findByParentId(parentId: string): Promise<Task[]>

    update(task: Task): Promise<Task>;

    findByAssigneeAndSprint(
        assigneeId: string,
        sprintId: string
    ): Promise<Task[]>;

    countByCompany(companyId: string): Promise<number>;

    countByStatus(
        companyId: string,
        status: TaskStatus
    ): Promise<number>;

    countOverdue(companyId: string): Promise<number>;

    getProjectHealth(companyId: string): Promise<{
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  health: number;
}[]>;
countTasksByStatusForUser(userId: string): Promise<
  { _id: TaskStatus; count: number }[]
>;

 getPriorityTasks(userId: string): Promise<{
  id: string;
  title: string;
  projectName: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}[]>

}