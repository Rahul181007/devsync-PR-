export interface ICompleteSprintUseCase{
    execute(
        userId:string,
        companyid:string,
        projectId:string,
        sprintId:string
    ):Promise<void>
}