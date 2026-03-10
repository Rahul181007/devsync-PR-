export interface GetPaymentHistoryDTO {
    userId: string
    companyId: string
}

export interface GetPaymentHistoryResponseDTO {
    id: string
    amount: number
    currency: string
    billingCycle: "MONTHLY" | "YEARLY"
    status: "PENDING" | "SUCCESS" | "FAILED"
    createdAt: Date
}