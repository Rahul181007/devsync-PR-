import { Request, Response } from "express";
import { ICreateMeetingUseCase } from "../../application/interface/meeting/ICreateMeetingUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createMeetingSchema } from "../../application/validators/meeting/createMeeting.validator";
import { handleError } from "../../shared/utils/handleError";
import { getMeetingsSchema } from "../../application/validators/meeting/getMeetings.validator";
import { IGetMeetingsUseCase } from "../../application/interface/meeting/IGetMeetingsUseCase";
import { IUpdateMeetingUsecase } from "../../application/interface/meeting/IUpdateMeetingUseCase";
import { updateMeetingSchema } from "../../application/validators/meeting/updateMeeting.validator";
import { IGetTodayMeetingsUseCase } from "../../application/interface/meeting/IGetTodayMeetingsUseCase";
import { IGetMissedMeetingsUseCase } from "../../application/interface/meeting/IGetMissedMeetingsUseCase";
import { IGetCompletedMeetingsUseCase } from "../../application/interface/meeting/IGetCompletedMeetingUseCase";

export class MeetingController {
    constructor(
        private _createMeetingUseCase: ICreateMeetingUseCase,
        private _getMeetingUseCase: IGetMeetingsUseCase,
        private _updateMeetingUseCase: IUpdateMeetingUsecase,
        private _getTodayMeetingsUseCase: IGetTodayMeetingsUseCase,
        private _getMissedMeetingsUseCase:IGetMissedMeetingsUseCase,
        private _getCompletedMeetingsUseCase:IGetCompletedMeetingsUseCase
    ) { }

    createMeeting = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const parsed = createMeetingSchema.parse({ ...req.body, projectId: req.params.projectId });
            const result = await this._createMeetingUseCase.execute(userId, companyId, parsed)
            return res.status(HttpStatus.CREATED).json({
                message: "meeting created successfully",
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }


    }
    getMeetings = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const parsedQuery = getMeetingsSchema.parse(req.query);
            const result = await this._getMeetingUseCase.execute(userId, companyId, {
                projectId: req.params.projectId,
                page: parsedQuery.page,
                limit: parsedQuery.limit,
                sprintId: parsedQuery.sprintId,
                type: parsedQuery.type
            })

            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res);
        }

    }

    updateMeeting = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const parsed = updateMeetingSchema.parse({
                ...req.body,
                meetingId: req.params.meetingId
            });

            const result = await this._updateMeetingUseCase.execute(
                userId,
                companyId,
                parsed
            );

            return res.status(HttpStatus.OK).json({
                message: "Meeting updated successfully",
                data: result
            });
        } catch (error: unknown) {
            return handleError(error, res);
        }
    }


    getTodayMeetings=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;
                    if (!userId || !companyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
            });
        }
        const result = await this._getTodayMeetingsUseCase.execute(
            userId,
            companyId,
            { projectId: req.params.projectId }
        );

        return res.status(HttpStatus.OK).json({
            data: result
        });

    } catch (error: unknown) {
        return handleError(error, res);
    }
    }


    getMissedMeetings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const companyId = req.user?.companyId;

        if (!userId || !companyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
            });
        }

        const result = await this._getMissedMeetingsUseCase.execute(
            userId,
            companyId,
            { projectId: req.params.projectId }
        );

        return res.status(HttpStatus.OK).json({
            data: result
        });

    } catch (error) {
        return handleError(error, res);
    }
}


    getCompletedMeetings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const companyId = req.user?.companyId;

        if (!userId || !companyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
            });
        }

        const result = await this._getCompletedMeetingsUseCase.execute(
            userId,
            companyId,
            { projectId: req.params.projectId }
        );

        return res.status(HttpStatus.OK).json({
            data: result
        });

    } catch (error) {
        return handleError(error, res);
    }
}
}