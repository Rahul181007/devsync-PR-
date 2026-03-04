import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { getSocketInstance } from "../../../infrastructure/websocket/socket.instance";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { ISuspendCompanyUseCase } from "../../interface/company/ISuspendCompanyUseCase";

export class SuspendCompanyUseCase implements ISuspendCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository,
              private _userRepo:IUserRepository,
              private _notificationRepo:INotificationRepository
    ){}

    async execute(companyId:string):Promise<void>{
        const company=await this._companyRepo.findById(companyId);
        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(company.status==='PENDING' || company.status==='SUSPENDED'){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.COMPANY_NOT_SUSPENDED,HttpStatus.BAD_REQUEST)
        }
        await this._companyRepo.updateStatus(company.id,'SUSPENDED')
        const companyAdmin = await this._userRepo.findCompanyAdminByCompany(company.id);

if (companyAdmin) {
    const notification=await this._notificationRepo.create({
        userId: companyAdmin.id,
        type: "COMPANY_SUSPENDED",
        title: "Company Suspended",
        message: `Your company "${company.name}" has been suspended.`,
        metadata: {
            companyId: company.id
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