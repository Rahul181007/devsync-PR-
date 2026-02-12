import { Request, Response } from "express";
import { ICreateTaskUseCase } from "../../application/interface/task/ICreateTaskUseCase";
import { createTaskSchema } from "../../application/validators/task/createTask.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";
import { IGetProjectTasksUseCase } from "../../application/interface/task/IGetBacklogTaskUseCase";
import { IGetTaskDetailUseCase } from "../../application/interface/task/IGetTaskDetailUseCase";
import { IUpdateTaskStatusUseCase } from "../../application/interface/task/IUpdateTaskStatusUseCase";
import { IGetDeveloperTasksUseCase } from "../../application/interface/task/IGetDeveloperTasksUseCase";
import { IUpdateDeveloperTaskStatusUseCase } from "../../application/interface/task/IUpdateDeveloperTaskStatusUseCase";
import { ISubmitTaskUseCase } from "../../application/interface/task/ISubmitTaskUseCase";
import { IGetDeveloperTaskDetailUseCase } from "../../application/interface/task/IGetDeveloperTaskDetailUseCase";






export class TaskController {
    constructor(
        private _createTaskUseCase: ICreateTaskUseCase,
        private _getProjectTasks: IGetProjectTasksUseCase,
        private _getTaskDetail: IGetTaskDetailUseCase,
        private _updateTaskStatusUseCase: IUpdateTaskStatusUseCase,
        private _getDeveloperTasksUseCase: IGetDeveloperTasksUseCase,
        private _updateDeveloperTaskStatusUseCase:IUpdateDeveloperTaskStatusUseCase,
        private _submitTaskUseCase:ISubmitTaskUseCase,
        private _getDeveloperTaskDetailUseCase:IGetDeveloperTaskDetailUseCase
    ) { }

    createTask = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const parsed = createTaskSchema.parse(req.body);

            const task = await this._createTaskUseCase.execute(userId, companyId, projectId, parsed);

            res.status(HttpStatus.CREATED).json({
                success: true,
                data: task
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getProjectTasks = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const tasks = await this._getProjectTasks.execute(userId, companyId, projectId);
            console.log("tasks",tasks)
            res.status(HttpStatus.OK).json({
                success: true,
                data: tasks
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getTaskDetail = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, taskId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            const task = await this._getTaskDetail.execute(userId, companyId, projectId, taskId);
            console.log(task)
            res.status(HttpStatus.OK).json({
                success: true,
                data: task
            })

        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId, taskId } = req.params;

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            await this._updateTaskStatusUseCase.execute(userId, companyId, projectId, taskId, req.body)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Task status updated successfully"
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getDeveloperTask = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const { projectId } = req.params;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const board =await this._getDeveloperTasksUseCase.execute(userId,projectId);

            res.status(HttpStatus.OK).json({
                success:true,
                data:board
            })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getDeveloperTaskDetail=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const {projectId,taskId}=req.params;

            if(!userId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const task =await this._getDeveloperTaskDetailUseCase.execute(userId,projectId,taskId);
            res.status(HttpStatus.OK).json({
                success:true,
                data:task
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    updateDeveloperTaskUseCase=async(req:Request,res:Response)=>{
        try {
           const userId=req.user?.id;
           const {projectId,taskId}=req.params;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            await this._updateDeveloperTaskStatusUseCase.execute(userId,projectId,taskId,req.body)

            res.status(HttpStatus.OK).json({
                success:true,
                message:'Task status updated'
            })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    submitTask=async(req:Request,res:Response)=>{
       try {
        const userId=req.user?.id;
        const {projectId,taskId}=req.params;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            await this._submitTaskUseCase.execute(userId,projectId,taskId,req.body)
            res.status(HttpStatus.OK).json({
                success:true,
                message:"Task submittted successfully"
            })
       } catch (error:unknown) {
         return handleError(error,res)
       }
    }
}