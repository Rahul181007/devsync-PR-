export interface PlanSprintTaskItemDTO{
    taskId:string;
    developerId:string
}

export interface PlanSprintRequestDTOS{
    sprintId:string;
    tasks:PlanSprintTaskItemDTO[]
}

export interface PlanSprintRequestDTO{
    sprintId:string;
    storyIds: string[];
}