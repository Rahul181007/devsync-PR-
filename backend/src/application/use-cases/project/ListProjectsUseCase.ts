
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { ListProjectsQuery } from "../../dto/project/listProjects.dto";
import { ListProjectsResponse } from "../../dto/project/listProjectsResponse.dto";
import { IListProjectsUseCase } from "../../interface/project/IListProjectsUseCase";




export class ListProjectsUseCase implements IListProjectsUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _projectMemberRepo: IProjectMemberRepository,
        private _userRepo: IUserRepository
    ) { }

    async execute(userId: string, companyId: string, input: ListProjectsQuery): Promise<ListProjectsResponse> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (user.role === 'COMPANY_ADMIN') {
            const result = await this._projectRepo.findAllByCompany(companyId, input);

            return {
                data: result.data,
                pagination: {
                    page: input.page,
                    limit: input.limit,
                    total: result.total,
                }

            }
        }

        if (user.role === 'DEVELOPER') {
            const projectIds = await this._projectMemberRepo.findUserProjects(userId);

            if (projectIds.length === 0) {
                return {
                    data: [],
                    pagination: {
                        page: input.page,
                        limit: input.limit,
                        total: 0,
                    }


                }
            }
            const result = await this._projectRepo.findAllByCompany(companyId, {
                ...input,
                projectIds
            })

            return {
                data: result.data,
                pagination: {
                    page: input.page,
                    limit: input.limit,
                    total: result.total,
                }



            }
        }
        throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
    }
}