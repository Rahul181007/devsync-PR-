

export interface IGetInvoiceUseCase{
    execute(userId:string,companyId:string,invoiceId:string):Promise<Buffer>
}