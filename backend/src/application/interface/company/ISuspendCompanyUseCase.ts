export interface ISuspendCompanyUseCase{
    execute(companyId:string,):Promise<void>
}