import { Request, Response } from "express";
import { ICreateWorklogUseCase } from "../../application/interface/worklog/ICreateWorklogUseCase";
import { IGetWorklogsByProjectUseCase } from "../../application/interface/worklog/IGetWorklogsByProjectUseCase";
import { IGetWorklogsByTaskUseCase1 } from "../../application/interface/worklog/IGetWorklogsByTaskUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createWorklogSchema } from "../../application/validators/worklog/createWorklog.validator";
import { handleError } from "../../shared/utils/handleError";
import { updateWorklogSchema } from "../../application/validators/worklog/updateWorklog.validator";
import { IUpdateWorklogUseCase } from "../../application/interface/worklog/IUpdateWorklogUseCase";
import { IDeleteWorklogUseCase } from "../../application/interface/worklog/IDeleteWorklogUseCase";
import { IGetTimesheetByProjectUseCase } from "../../application/interface/worklog/IGetTimesheetByProjectUseCase";

export class WorklogController {
  constructor(
    private _createWorklogUseCase: ICreateWorklogUseCase,
    private _getWorklogsByTaskUseCase: IGetWorklogsByTaskUseCase1,
    private _getWorklogsByProjectUseCase: IGetWorklogsByProjectUseCase,
    private _updateWorklogUseCase: IUpdateWorklogUseCase,
    private _deleteWorklogUseCase: IDeleteWorklogUseCase,
    private _getTimesheetByProjectUseCase: IGetTimesheetByProjectUseCase,
  ) { }

  createWorklog = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const companyId = req.user?.companyId;
      if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const { projectId, taskId } = req.params;
      const parsed = createWorklogSchema.parse(req.body);

      await this._createWorklogUseCase.execute(
        userId,
        companyId,
        projectId,
        taskId,
        parsed,
      );
      return res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };

  getByTask = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const companyId = req.user?.companyId;

      if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const { projectId, taskId } = req.params;

      const data = await this._getWorklogsByTaskUseCase.execute(
        userId,
        companyId,
        projectId,
        taskId,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };

  getByProject = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const companyId = req.user?.companyId;

      if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const { projectId } = req.params;

      const { startDate, endDate, userId: filterUserId } = req.query;

      const data = await this._getWorklogsByProjectUseCase.execute(
        userId,
        companyId,
        projectId,
        {
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
          userId: filterUserId as string | undefined,
        },
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };

  updateWorklog = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;

    const { projectId, worklogId } = req.params;

    if (!userId || !companyId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    const parsed = updateWorklogSchema.parse(req.body);

    await this._updateWorklogUseCase.execute(
      userId,
      companyId,
      projectId,
      worklogId,
      parsed,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
    });
  };

  deleteWorklog = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;

    const { projectId, worklogId } = req.params;

    if (!userId || !companyId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    await this._deleteWorklogUseCase.execute(
      userId,
      companyId,
      projectId,
      worklogId,
    );

    return res.status(HttpStatus.OK).json({
      success: true,
    });
  };


  getTimesheetByProject = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const companyId = req.user?.companyId;
      if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const {projectId}=req.params;
      const {startDate,endDate,userId:filterUserId}=req.query

      const data=await this._getTimesheetByProjectUseCase.execute(
        userId,
        companyId,
        projectId,
        {
            startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        userId: filterUserId as string | undefined,

        }
      )

      return res.status(HttpStatus.OK).json({
        success:true,
        data
      })

    } catch (error:unknown) {
       return handleError(error,res)
    }
  }
}
