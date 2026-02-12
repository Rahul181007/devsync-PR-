import { Task, TaskPriority, TaskStatus } from "../entities/task.entity";
export interface CreateTaskInput {
    companyId: string;
    projectId: string;
    sprintId: string | null;
    code: string;

    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    reporterId: string;
    assigneeId?: string | null;

    dueDate?: Date | null
}
export interface ITaskRepository {
    create(task: CreateTaskInput): Promise<Task>;

    findById(taskId: string): Promise<Task | null>;

    findByProjectId(projectId: string): Promise<Task[]>;

    findBacklogTasks(projectId: string): Promise<Task[]>;

    update(task: Task): Promise<Task>;

    findByAssigneeAndSprint(
        assigneeId: string,
        sprintId: string
    ): Promise<Task[]>;
}