export type SubscriptionStatus =
    | "ACTIVE"
    | "CANCELLED"
    | "EXPIRED"
    | "PENDING";

export type BillingCycle =
    | "MONTHLY"
    | "YEARLY";

export class Subscription {
    constructor(
        public readonly id: string,
        public companyId: string,
        public planId: string,
        public status: SubscriptionStatus,
        public billingCycle: BillingCycle,
        public startDate: Date ,
        public endDate: Date | null,
        public renewsAt: Date | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}