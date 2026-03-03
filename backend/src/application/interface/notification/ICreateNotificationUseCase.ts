import { NotificationType } from "../../../domain/entities/notification.entity";

export interface ICreateNotificationUseCase{
    execute(params:{
        userId:string;
        type:NotificationType;
        title:string;
        message:string;
        metadata?:Record<string,unknown>|null
    }):Promise<void>
}