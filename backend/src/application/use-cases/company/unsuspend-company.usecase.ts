import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { getSocketInstance } from "../../../infrastructure/websocket/socket.instance";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IUnsuspendCompanyUseCase } from "../../interface/company/IUnsuspendCompanyUseCase";

export class UnsuspendCompanyUseCase implements IUnsuspendCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository,
              private _userRepo:IUserRepository,
      private _notificationRepo:INotificationRepository
    ){}

    async execute(companyId:string):Promise<void>{
        const company=await this._companyRepo.findById(companyId);

        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND);
        }

        if(company.status!=='SUSPENDED'){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.COMPANY_NOT_SUSPENDED,HttpStatus.BAD_REQUEST)
        }

        await this._companyRepo.updateStatus(companyId,'APPROVED');
        const companyAdmin = await this._userRepo.findCompanyAdminByCompany(companyId);

if (companyAdmin) {
    const notification=await this._notificationRepo.create({
        userId: companyAdmin.id,
        type: "COMPANY_REACTIVATED",
        title: "Company Reactivated",
        message: `Your company has been reactivated.`,
        metadata: {
            companyId
        }
    });

                    const io = getSocketInstance();
    
                io.to(`user:${companyAdmin.id}`).emit("new_notification", {
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    metadata: notification.metadata,
                    isRead: false,
                    createdAt: notification.createdAt,
                });

}
    }
}