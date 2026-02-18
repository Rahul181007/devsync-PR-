export interface ProjectTaskListItemDTO{
    id:string;
    code:string;
    title:string;
    status:string;
    priority:string;
    dueDate:Date|null;
    sprintId:string|null
    assignee:{
        id:string;
        name:string;
        avatarUrl?:string
    }|null
}