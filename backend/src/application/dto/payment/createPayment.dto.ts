export interface CreatePaymentDTO{
    userId:string;
    companyId:string;
    planId:string;
    billingCycle:"MONTHLY" | "YEARLY";
}