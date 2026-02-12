export interface ProjectTaskListItemDTO{
    id:string;
    title:string;
    status:string;
    priority:string;
    dueDate:Date|null;
    assignee:{
        id:string;
        name:string;
        avatarUrl?:string
    }|null
}