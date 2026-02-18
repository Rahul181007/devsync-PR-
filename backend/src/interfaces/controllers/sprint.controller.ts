import { Request, Response } from "express";
import { ICreateSprintUseCase } from "../../application/interface/sprint/ICreateSprintUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createSprintSchema } from "../../application/validators/sprint/createSprint.validator";
import { handleError } from "../../shared/utils/handleError";
import { IListSprintUseCase } from "../../application/interface/sprint/IListSprintUseCase";
import { IGetSprintDetailUseCase } from "../../application/interface/sprint/IGetSprintDetailUseCase";
import { IActivateSprintUseCase } from "../../application/interface/sprint/IActivateSprintUseCase";
import { ICompleteSprintUseCase } from "../../application/interface/sprint/ICompleteSprintUseCase";

export class SprintController {
    constructor(
        private _createSprintUseCase: ICreateSprintUseCase,
        private _lisstSprintUseCase: IListSprintUseCase,
        private _getSprintDetailUseCase: IGetSprintDetailUseCase,
        private _activateSprintUseCase: IActivateSprintUseCase,
        private _completeSprintUseCase: ICompleteSprintUseCase
    ) { }

    createSprint = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const parsed = createSprintSchema.parse(req.body);

            const sprint = await this._createSprintUseCase.execute(userId, companyId, projectId, parsed);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                data: sprint
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getProjectSprints = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const sprints = await this._lisstSprintUseCase.execute(userId, companyId, projectId);

            return res.status(HttpStatus.OK).json({
                success: true,
                data: sprints
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getSprintDetail = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, sprintId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const data = await this._getSprintDetailUseCase.execute(userId, companyId, projectId, sprintId);
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    activateSprint = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, sprintId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                });
            }

            await this._activateSprintUseCase.execute(
                userId,
                companyId,
                projectId,
                sprintId
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.SPRINT.SPRINT_ACTIVATED,
            });

        } catch (error: unknown) {
            return handleError(error, res);
        }
    }

    completeSprint = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, sprintId } = req.params;

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                });
            }

            await this._completeSprintUseCase.execute(
                userId,
                companyId,
                projectId,
                sprintId
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Sprint completed successfully",
            });

        } catch (error: unknown) {
            return handleError(error, res);
        }

    }
}