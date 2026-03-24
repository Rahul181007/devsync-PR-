import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { GetProfileResponseDTO } from "../../dto/auth/getProfile.dto";
import { IGetProfileUseCase } from "../../interface/auth/IGetProfileUseCase";

export class GetProfileUseCase implements IGetProfileUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _superAdminRepo:ISuperAdminRepository,
        private _companyRepo:ICompanyRepository,
    ){}

    async execute(userId: string): Promise<GetProfileResponseDTO> {
        const user=await this._userRepo.findById(userId);

        if(user){
            let companyLogo:string|null=null;

            if(user.companyId){
                const company=await this._companyRepo.findById(user.companyId);
                companyLogo=company?.logoUrl??null
            }
            return {
                name:user.name,
                email:user.email,
                avatarUrl:user.avatarUrl,
                role:user.role,
                companyLogo
            }
        }

        const superAdmin=await this._superAdminRepo.findById(userId);
        if(!superAdmin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        return {
            name:superAdmin.name,
            email:superAdmin.email,
            avatarUrl:superAdmin.avatarUrl,
            role:superAdmin.role,
            companyLogo:null
        }
    }
}