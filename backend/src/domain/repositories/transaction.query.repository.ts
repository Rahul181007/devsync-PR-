export interface Transaction {
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

export interface GetTransactionOptions {
    page: number;
    limit: number;
    search?: string;
    status?: "PENDING" | "SUCCESS" | "FAILED";

    fromDate?: string;
    toDate?: string;
}

export interface TransactionListResult {
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
}

export interface ITransactionQueryRepository {
    getAllTransactions(
        options: GetTransactionOptions
    ): Promise<TransactionListResult>;
}