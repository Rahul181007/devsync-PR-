export class Invoice{
    constructor(
        public readonly id:string,
        public companyId:string,
        public paymentId:string,
        public planId:string,
        public billingCycle:"MONTHLY" | "YEARLY",
        public subtotal:number,
        public tax:number,
        public total:number,
        public currency:string,
        public invoiceNumber:string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ){}
}

