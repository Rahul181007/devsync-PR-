import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { getSocketInstance } from "../../../infrastructure/websocket/socket.instance";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreateWorkspaceDTO } from "../../dto/company/createWorkspace.dto";
import { CreateWorkspaceResponse } from "../../dto/company/createWorkspaceResponse.dto";
import { ICreateWorkspaceUseCase } from "../../interface/company/ICreateWorkspaceUseCase";

export class CreateWorkspaceUseCase implements ICreateWorkspaceUseCase {
    constructor(
        private _companyRepo: ICompanyRepository,
        private _userRepo: IUserRepository,
        private _superAdminRepo: ISuperAdminRepository,
        private _notificationRepo: INotificationRepository,
        private _planRepo: IPlanRepository,
        private _subscriptionRepo: ISubscriptionRepository
    ) { }

    private _generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
    }

    async execute(userId: string, data: CreateWorkspaceDTO): Promise<CreateWorkspaceResponse> {
        const normalizedName = data.name.trim();
        const normalizedDomain = data.domain
            ? data.domain.trim().toLowerCase()
            : undefined;

        const user = await this._userRepo.findById(userId)
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        if (user.status !== 'PENDING_ONBOARDING') {
            throw new AppError(RESPONSE_MESSAGES.AUTH.WORKSPACE_CREATION_NOT_ALLOWED, HttpStatus.FORBIDDEN);
        }

        if (user.companyId !== null) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.WORKSPACE_ALREADY_EXISTS, HttpStatus.FORBIDDEN)
        }

        const slug = this._generateSlug(data.name)

        const existingByName = await this._companyRepo.findByName(normalizedName);
        if(existingByName){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NAME_ALREADY_EXISTS, HttpStatus.CONFLICT)
        }
        const existingByDomain = await this._companyRepo.findByDomain(normalizedDomain!);
        if(normalizedDomain && existingByDomain){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.DOMAIN_ALREADY_EXISTS, HttpStatus.CONFLICT)
        }

        const newCompany = await this._companyRepo.create({
            name: normalizedName,
            domain: normalizedDomain,
            slug,
            createdBy: 'self',
            adminEmail: user.email,
            status: 'PENDING',
            onboardingStep: 'BRANDING',
            ownerAdminId: user.id,
        })

        const freePlan = await this._planRepo.findDefaultPlan();
        if (!freePlan) {
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        const subscription=await this._subscriptionRepo.create({
            companyId:newCompany.id,
            planId:freePlan.id,
            status:"ACTIVE",
            billingCycle:"MONTHLY",
            startDate:new Date(),
            endDate:null,
            renewsAt:null
        })

        await this._companyRepo.updateSubscription(newCompany.id,{
            currentPlanId:freePlan.id,
            subscriptionId:subscription.id
        })

        const superAdmin = await this._superAdminRepo.findActive();

        if (superAdmin) {
            const notification = await this._notificationRepo.create({
                userId: superAdmin.id,
                type: "COMPANY_SUBMITTED_FOR_APPROVAL",
                title: "New Company Awaiting Approval",
                message: `Company "${newCompany.name}" has been submitted for approval.`,
                metadata: {
                    companyId: newCompany.id
                }
            });

            const io = getSocketInstance();

            io.to(`user:${superAdmin.id}`).emit("new_notification", {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                metadata: notification.metadata,
                isRead: false,
                createdAt: notification.createdAt,
            });
        }
        await this._userRepo.assignCompany(user.id, newCompany.id)
        await this._userRepo.updateStatus(user.id, "ACTIVE")

        return {
            userId: user.id,
            companyId: newCompany.id,
            role: user.role
        }
    }
}