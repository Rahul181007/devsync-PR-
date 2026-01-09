
import { OnboardingStep } from "../../../domain/entities/company.entity";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class GetAuthMeUseCase {
    constructor(
        private userRepo: IUserRepository,
        private companyRepo: ICompanyRepository,
        private superAdminRepo: ISuperAdminRepository,
    ) { }

    async execute(userId: string, role: string) {

        if (role === 'SUPER_ADMIN') {
            const admin = await this.superAdminRepo.findById(userId);
            if (!admin) {
                throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }

            return {
                user: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                requiresOnboarding: false,
                waitingForApproval: false,
                onboardingStep:null,
            }
        }

        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        let requiresOnboarding = false;
        let waitingForApproval = false;
        let onboardingStep:OnboardingStep|null=null
        
        if (user.role === 'COMPANY_ADMIN') {
            if (!user.companyId) {
                requiresOnboarding = true;
                onboardingStep='WORKSPACE'
            } else {
                const company = await this.companyRepo.findById(user.companyId)
               if(!company){
                throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
               }

               onboardingStep=company.onboardingStep

               if(company.onboardingStep!=='DONE'){
                requiresOnboarding=true;
               }else if(company.status!=='APPROVED'){
                waitingForApproval=true;
               }
            }
        }


        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            },
            requiresOnboarding,
            waitingForApproval,
            onboardingStep

        }
    }


}