export interface IDeletePlanUseCase{
    execute(
        planId:string,superAdminId:string
    ):Promise<void>
}