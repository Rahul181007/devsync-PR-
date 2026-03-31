export interface TransactionResponseDTO {
    paymentId: string;
    orderId: string;

    companyId: string;
    companyName: string;

    planId: string;
    planName: string;

    billingCycle: "MONTHLY" | "YEARLY";

    amount: number;
    currency: string;

    status: "PENDING" | "SUCCESS" | "FAILED";

    invoiceNumber?: string | null;
    invoiceId?: string | null;

    subtotal?: number | null;
    tax?: number | null;
    total?: number | null;

    createdAt: Date;
}

export interface TransactionListResponseDTO {
    data: TransactionResponseDTO[];
    total: number;
    page: number;
    limit: number;
}