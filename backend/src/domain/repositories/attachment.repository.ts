import { TaskAttachment } from "../entities/Attachment.entity"

export interface ITaskAttachmentRepository{
    create(data:{
        taskId:string,
        projectId:string,
        companyId: string;
        uploadedBy:string,
        fileName:string,
        fileUrl:string
    }):Promise<TaskAttachment>

    findByTaskId(taskId:string):Promise<TaskAttachment[]>
}