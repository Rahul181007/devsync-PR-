export class Payment {
    constructor(
    public readonly id: string,
    public companyId: string,
    public planId: string,
    public billingCycle: "MONTHLY" | "YEARLY",
    public orderId: string,
    public paymentId: string | null,
    public amount: number,
    public currency: string,
    public status: "PENDING" | "SUCCESS" | "FAILED",
    public createdAt: Date,
    public updatedAt:Date,
    ){}
}