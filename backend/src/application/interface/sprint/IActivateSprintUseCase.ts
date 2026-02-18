export interface IActivateSprintUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        sprintId:string
    ):Promise<void>
}