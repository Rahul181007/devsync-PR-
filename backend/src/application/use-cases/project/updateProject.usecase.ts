import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateProjectDTO } from "../../dto/project/updateProject.dto";

export class UpdateProjectUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository
    ) { }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    }

    async execute(
        userId: string,
        companyId: string,
        projectId: string,
        data: UpdateProjectDTO
    ) {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (user.role !== 'COMPANY_ADMIN') {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        if (project.status === "ARCHIVED") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ARCHIVED,
                HttpStatus.FORBIDDEN
            );
        }

        let slug: string | undefined;

        if (data.name && data.name !== project.name) {
            const existing = await this._projectRepo.findByNameInCompany(companyId, data.name);

            if (existing) {
                throw new AppError(RESPONSE_MESSAGES.PROJECT.ALREADY_EXISTS, HttpStatus.CONFLICT)

            }
            slug = this.generateSlug(data.name);
        }
        const updated = await this._projectRepo.update(projectId, {
            ...data,
            ...(slug ? { slug } : {})
        })
        if (!updated) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        return updated
    }
}