import { Subscription } from "../../domain/entities/subscription.entity";
import { CreateSubscriptionData, ISubscriptionRepository } from "../../domain/repositories/subscription.repository";
import { ISubscriptionDocument, SubscriptionModel } from "../db/models/subscription.model";

export class SubscriptionRepository implements ISubscriptionRepository{
    private _toDomain(doc:ISubscriptionDocument):Subscription{
        return new Subscription(
            doc._id.toString(),
            doc.companyId.toString(),
            doc.planId.toString(),
            doc.status,
            doc.billingCycle,
            doc.startDate,
            doc.endDate??null,
            doc.renewsAt??null,
            doc.createdAt,
            doc.updatedAt
        )
    }

    async create(data: CreateSubscriptionData): Promise<Subscription> {
        const doc=await SubscriptionModel.create(data);
        return this._toDomain(doc)
    }

    async findActiveByCompany(companyId: string): Promise<Subscription | null> {
        const doc=await SubscriptionModel.findOne({
            companyId,
            status:"ACTIVE"
        })

        if(!doc)return null;
        return this._toDomain(doc)
    }


    async findById(subscriptionId: string): Promise<Subscription | null> {
        const doc=await SubscriptionModel.findById(subscriptionId);
        if(!doc)return null;
        return this._toDomain(doc)
    }

    async cancel(subscriptionId: string): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscriptionId,{
            status:"CANCELLED",
            endDate:new Date()
        })
    }

    async save(subscription: Subscription): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscription.id,{
            status:subscription.status,
            billingCycle:subscription.billingCycle,
            startDate:subscription.startDate,
            endDate:subscription.endDate,
            renewsAt:subscription.renewsAt
        })
    }
}