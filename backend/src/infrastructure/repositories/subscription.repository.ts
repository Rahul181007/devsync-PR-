import { Subscription } from "../../domain/entities/subscription.entity";
import { CreateSubscriptionData, ISubscriptionRepository } from "../../domain/repositories/subscription.repository";
import { SubscriptionModel } from "../db/models/subscription.model";
import { SubscriptionMapper } from "../mappers/subscription/subscription.mapper";

export class SubscriptionRepository implements ISubscriptionRepository{


    async create(data: CreateSubscriptionData): Promise<Subscription> {
        const doc=await SubscriptionModel.create(SubscriptionMapper.toDocument(data));
        return SubscriptionMapper.toDomain(doc)
    }

    async findActiveByCompany(companyId: string): Promise<Subscription | null> {
        const doc=await SubscriptionModel.findOne({
            companyId,
            status:"ACTIVE"
        })

        if(!doc)return null;
        return SubscriptionMapper.toDomain(doc)
    }


    async findById(subscriptionId: string): Promise<Subscription | null> {
        const doc=await SubscriptionModel.findById(subscriptionId);
        if(!doc)return null;
        return SubscriptionMapper.toDomain(doc)
    }

    async cancel(subscriptionId: string): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscriptionId,{
            status:"CANCELLED",
            endDate:new Date()
        })
    }

    async save(subscription: Subscription): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscription.id,
            SubscriptionMapper.toDocument(subscription)
        )
    }
}