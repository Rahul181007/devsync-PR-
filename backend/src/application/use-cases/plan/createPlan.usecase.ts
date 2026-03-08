import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreatePlanDTO } from "../../dto/plan/createPlan.dto";
import { ICreatePlanUseCase } from "../../interface/plan/ICreatePlanUseCase";

export class CreatePlanUseCase implements ICreatePlanUseCase{
    constructor(
        private _planRepo:IPlanRepository,
        private _superAdminRepo:ISuperAdminRepository
    ){}

        private _generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
    }

    async execute(data: CreatePlanDTO, superAdminId: string): Promise<void> {
        const superAdmin=await this._superAdminRepo.findById(superAdminId);

        if(!superAdmin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(superAdmin.role!==Role.SUPER_ADMIN){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const existingName=await this._planRepo.findByName(data.name);

        if(existingName){
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.ALREADY_EXISTS,
                HttpStatus.BAD_REQUEST
            )
        }
        const slug = this._generateSlug(data.name)
        const existingSlug=await this._planRepo.findBySlug(slug);
        if(existingSlug){
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.SLUG_ALREADY_EXISTS,
                HttpStatus.BAD_REQUEST
            )
        }

        await this._planRepo.create({
            ...data,
            slug,
            isActive:true
        })
    }
}