export  interface IJoinProjectChatUseCase{
    execute(userId:string,companyId:string,projectId:string):Promise<void>
}