export interface PlanSprintTaskItemDTO{
    taskId:string;
    developerId:string
}

export interface PlanSprintRequestDTO{
    sprintId:string;
    tasks:PlanSprintTaskItemDTO[]
}