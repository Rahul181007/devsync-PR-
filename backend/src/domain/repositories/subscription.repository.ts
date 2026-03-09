import { Subscription } from "../entities/subscription.entity";

export interface CreateSubscriptionData {
    companyId: string;
    planId: string;
    status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
    billingCycle: "MONTHLY" | "YEARLY";
    startDate: Date;
    endDate?: Date | null;
    renewsAt?: Date | null;
}

export interface ISubscriptionRepository{
    create(data:CreateSubscriptionData):Promise<Subscription>;

    findActiveByCompany(companyId:string):Promise<Subscription|null>;

    findById(subscriptionId:string):Promise<Subscription|null>;

    cancel(subscriptionId:string):Promise<void>;

    save(subscription:Subscription):Promise<void>
}