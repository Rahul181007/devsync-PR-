import { Request, Response } from "express";
import { ICreatePlanUseCase } from "../../application/interface/plan/ICreatePlanUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createPlanSchema } from "../../application/validators/plan/createPlan.validator";
import { handleError } from "../../shared/utils/handleError";
import { IGetPlanUseCase } from "../../application/interface/plan/getPlans.usecase";
import { getPlansSchema } from "../../application/validators/plan/getPlans.validator";
import { IGetPlanByIdUseCase } from "../../application/interface/plan/IGetPlanByIdUseCase";
import { IUpdatePlanUseCase } from "../../application/interface/plan/IUpdatePlanUseCase";
import { updatePlanSchema } from "../../application/validators/plan/updatePlan.validator";
import { IDeletePlanUseCase } from "../../application/interface/plan/IDeletePlanUseCase";
import { IGetAvailablePlansUseCase } from "../../application/interface/plan/IGetAvailablePlansUseCase";

export class PlanController {
    constructor(
        private _createPlanUseCase: ICreatePlanUseCase,
        private _getPlansUseCase: IGetPlanUseCase,
        private _getPlanByIdUseCase: IGetPlanByIdUseCase,
        private _updatePlanUseCase: IUpdatePlanUseCase,
        private _deletePlanUseCase: IDeletePlanUseCase,
        private _getAvailablePlanUseCase: IGetAvailablePlansUseCase
    ) { }

    createPlan = async (req: Request, res: Response) => {
        try {
            const superAdminId = req.user?.id;

            if (!superAdminId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const parsed = createPlanSchema.parse(req.body);

            await this._createPlanUseCase.execute(parsed, superAdminId);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: RESPONSE_MESSAGES.PLAN.CREATED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getPlan = async (req: Request, res: Response) => {
        try {
            const superAdminId = req.user?.id;

            if (!superAdminId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const parsed = getPlansSchema.parse({
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search,
                status: req.query.status
            });

            const plans = await this._getPlansUseCase.execute(
                parsed,
                superAdminId
            )

            return res.status(HttpStatus.OK).json({
                success: true,
                data: plans
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    getPlanBYId = async (req: Request, res: Response) => {
        try {
            const superAdminId = req.user?.id;
            const { planId } = req.params;
            if (!superAdminId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const plan = await this._getPlanByIdUseCase.execute(planId, superAdminId);

            return res.status(HttpStatus.OK).json({
                success: true,
                data: plan
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    updatePlan = async (req: Request, res: Response) => {
        try {
            const superAdminId = req.user?.id;
            const { planId } = req.params;

            if (!superAdminId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const parsed = updatePlanSchema.parse(req.body);
            await this._updatePlanUseCase.execute(planId, parsed, superAdminId);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.PLAN.UPDATED
            })

        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    deletePlan = async (req: Request, res: Response) => {
        try {
            const superAdminId = req.user?.id;
            const { planId } = req.params;

            if (!superAdminId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            await this._deletePlanUseCase.execute(planId, superAdminId);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.PLAN.DELETED
            });
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    availablePlans = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const plans = await this._getAvailablePlanUseCase.execute(userId, companyId);

            return res.status(HttpStatus.OK).json({
                success: true,
                data: plans
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}