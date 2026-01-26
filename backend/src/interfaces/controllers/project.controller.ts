import { Request, Response } from "express";
import { CreateFirstProjectUseCase } from "../../application/use-cases/project/createFirstProject.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createProjectSchema, createProjectWithMembersSchema } from "../../application/validators/project/createProject.validator";
import { handleError } from "../../shared/utils/handleError";
import { logger } from "../../shared/logger/logger";
import { ListProjectsUseCase } from "../../application/use-cases/project/ListProjectsUseCase";
import { listProjectsQuerySchema } from "../../application/validators/project/listProjects.validator";
import { GetProjectDetailUseCase } from "../../application/use-cases/project/getProjectDetail.usecase";
import { UpdateProjectUseCase } from "../../application/use-cases/project/updateProject.usecase";
import { updateProjectSchema } from "../../application/validators/project/updateProject.validator";
import { DeleteProjectUseCase } from "../../application/use-cases/project/deleteProject.usecase";
import { CreateProjectUseCase } from "../../application/use-cases/project/createProject.usecase";
import { addProjectMemberSchema } from "../../application/validators/project/addProjectMember.validator";
import { AddProjectMemberUseCase } from "../../application/use-cases/project/addProjectMember.usecase";
import { RemoveProjectMemberUseCase } from "../../application/use-cases/project/removeProjectMember.usecase";

export class ProjectController {
    constructor(
        private _createFirstProjectUseCase: CreateFirstProjectUseCase,
        private _listProjectUseCase: ListProjectsUseCase,
        private _getProjectDetailUseCase: GetProjectDetailUseCase,
        private _updateProjectUseCase: UpdateProjectUseCase,
        private _deleteProjectUseCase: DeleteProjectUseCase,
        private _createProjectUseCase: CreateProjectUseCase,
        private _addProjectMemberUseCase: AddProjectMemberUseCase,
        private _removeProjectMemberUseCase: RemoveProjectMemberUseCase

    ) { }

    createFirstProject = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;

            if (!userId || !companyId) {
                logger.warn('Create first project failed: unauthorized access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            logger.info('Create first project requested')

            const parsed = createProjectSchema.parse(req.body)

            const project = await this._createFirstProjectUseCase.execute(userId, companyId, parsed)

            logger.info('First project created successfully');

            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.PROJECT.CREATED,
                data: {
                    id: project.id,
                    name: project.name,
                    slug: project.slug
                }
            })
        } catch (error: unknown) {
            logger.error('Create first project failed', { userId: req.user?.id, companyId: req.user?.companyId, error });
            return handleError(error, res)
        }
    }

    listProjects = async (req: Request, res: Response) => {
        try {
            const query = listProjectsQuerySchema.parse(req.query);
            const userId = req.user?.id
            const companyId = req.user?.companyId

            if (!userId || !companyId) {
                logger.warn('List  project failed: unauthorized access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const result = await this._listProjectUseCase.execute(userId, companyId, query);

            return res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.PROJECT.LIST_FETCHED,
                data: result
            })
        } catch (error: unknown) {
            logger.error('List project filed', {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                error
            });
            return handleError(error, res)
        }
    }

    getProjectDetail = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                logger.warn('Get project default failed:unauthorised acess');
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            if (!projectId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.PROJECT.ID_REQUIRED,
                })

            }
            logger.info('get project detail is requested')

            const project = await this._getProjectDetailUseCase.execute(userId, companyId, projectId)
            return res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.PROJECT.FETCHED,
                data: project
            })
        } catch (error: unknown) {
            logger.error("Get project detail failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                projectId: req.params?.projectId,
                error
            });
            return handleError(error, res)
        }
    }

    updateProject = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                logger.warn("Update project failed: unauthorized access");
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            if (!projectId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.PROJECT.ID_REQUIRED
                })
            }

            const parsed = updateProjectSchema.parse(req.body)
            logger.info("Update project requested")
            const updatedProject = await this._updateProjectUseCase.execute(userId, companyId, projectId, parsed)
            return res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.PROJECT.UPDATED,
                data: updatedProject
            })

        } catch (error: unknown) {
            logger.error("Update project failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                projectId: req.params?.projectId,
                error
            });

            return handleError(error, res);
        }
    }

    deleteProject = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                logger.warn('Delete project failed unauthorized access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            if (!projectId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.PROJECT.ID_REQUIRED
                })
            }
            logger.info("Delete project requested")
            await this._deleteProjectUseCase.execute(userId, companyId, projectId)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (error: unknown) {
            logger.error("Delete project failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                projectId: req.params?.projectId,
                error
            });

            return handleError(error, res);
        }
    }

    createProject = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;

            if (!userId || !companyId) {
                logger.warn('Create project failed unauthorised access');
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }
            const parsed = createProjectWithMembersSchema.parse(req.body);
            logger.info('create project requested');

            const project = await this._createProjectUseCase.execute(userId, companyId, parsed)

            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.PROJECT.CREATED,
                data: project
            })
        } catch (error) {
            logger.error("Create project failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                error
            });

            return handleError(error, res);
        }
    }

    addProjectMember = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                logger.warn("Add project member failed: unauthorized access");
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const parsed = addProjectMemberSchema.parse(req.body);

            logger.info('AddProject member requested')

            await this._addProjectMemberUseCase.execute(userId, companyId, projectId, parsed);

            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.PROJECT.MEMBER_ADDED
            })
        } catch (error: unknown) {
            logger.error("Add project member failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                projectId: req.params?.projectId,
                error
            });

            return handleError(error, res);
        }
    }

    removeProjectMember = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, memberId } = req.params;

            if (!userId || !companyId) {
                logger.warn('Remove project member failed unauthorized access');
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            if (!projectId || !memberId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.PROJECT.ID_REQUIRED
                })
            }

            logger.info('Remove project member required')

            await this._removeProjectMemberUseCase.execute(userId, companyId, projectId, memberId);

            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error: unknown) {
            logger.error("Remove project member failed", {
                userId: req.user?.id,
                companyId: req.user?.companyId,
                projectId: req.params?.projectId,
                memberId: req.params?.memberId,
                error
            });

            return handleError(error, res);
        }
    }
}