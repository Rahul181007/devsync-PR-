export interface IGetInvoiceForSuperAdminUseCase{
      execute(userId: string, invoiceId: string): Promise<Buffer>
}