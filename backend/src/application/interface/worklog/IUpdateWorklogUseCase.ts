export interface IUpdateWorklogUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        worklogId:string,
        data:{
            timeSpent?:number;
            description?:string;
            date?:Date
        }
    ):Promise<void>
}